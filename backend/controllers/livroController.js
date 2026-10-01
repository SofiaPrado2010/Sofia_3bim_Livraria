const { query } = require('../database');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Listar todos os livros
exports.listarLivros = async (req, res) => {
    try {
        const result = await query('SELECT * FROM livros ORDER BY id_livro');
        res.json({ sucesso: true, livros: result.rows });
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar livros.' });
    }
};

// Obter livro por ID
exports.obterLivro = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ sucesso: false, mensagem: 'ID inválido.' });
        }

        const result = await query('SELECT * FROM livros WHERE id_livro = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Livro não encontrado.' });
        }

        res.json({ sucesso: true, livro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter livro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar livro
exports.criarLivro = async (req, res) => {
    try {
        const { id_livro, nome_livro, autor, preco, numero_paginas, id_genero } = req.body;

        if (!nome_livro) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do livro é obrigatório.' });
        }

        const sql = `
            INSERT INTO livros (id_livro, nome_livro, autor, preco, numero_paginas, id_genero)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [
            id_livro,
            nome_livro,
            autor,
            preco || 0.0,
            numero_paginas || 0,
            id_genero || null

        ];

        const result = await query(sql, values);
        res.status(201).json({ sucesso: true, mensagem: 'Livro inserido com sucesso!', livro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O gênero informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir gênero no banco de dados.' });
    }
};

// Atualizar livro
exports.atualizarLivro = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { nome_livro, autor, preco, numero_paginas, id_genero } = req.body;

        const sql = `
            UPDATE livros 
            SET nome_livro = $1, 
                autor = $2, 
                preco = $3,
                numero_paginas = $4,
                id_genero = $5
            WHERE id_livro = $6
            RETURNING *
        `;

        const values = [
            nome_livro,
            autor,
            preco || 0.0,
            numero_paginas || 0,
            id_genero || null,
            id
        ];

        const result = await query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Livro não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Livro alterado com sucesso!', livro: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'O gênero informado não existe no cadastro.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar livro.' });
    }
};

// Upload e salvamento de imagem com Sharp
exports.uploadImagem = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.file) {
            return res.status(400).json({ sucesso: false, mensagem: 'Nenhum arquivo enviado.' });
        }

        const pastaImagens = path.join(__dirname, '../../imagens');
        if (!fs.existsSync(pastaImagens)) {
            fs.mkdirSync(pastaImagens, { recursive: true });
        }

        const caminhoDestino = path.join(pastaImagens, `${id}.png`);

        // Processa e converte para PNG no tamanho ideal
        await sharp(req.file.buffer)
            .resize(300, 300, { fit: 'cover' })
            .toFormat('png')
            .toFile(caminhoDestino);

        res.json({ sucesso: true, mensagem: 'Imagem salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao processar imagem.' });
    }
};

// Deletar Livro
exports.deletarLivro = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        await query('DELETE FROM livros WHERE id_livro = $1', [id]);

        const imgPath = path.join(__dirname, '../../imagens', `${id}.png`);
        if (fs.existsSync(imgPath)) {
            fs.unlinkSync(imgPath);
        }

        res.json({ sucesso: true, mensagem: 'Livro excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir livro.' });
    }
};