const { query } = require('../database');

// Listar todas os generos
exports.listarGeneros = async (req, res) => {
    try {
        const result = await query('SELECT * FROM generos ORDER BY id_genero');
        res.json({ sucesso: true, generos: result.rows });
    } catch (error) {
        console.error('Erro ao listar generos:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar gêneros.' });
    }
};

// Obter genero por ID
exports.obterGenero = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';

        const result = await query('SELECT * FROM generos WHERE id_genero = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Gênero não encontrado.' });
        }

        res.json({ sucesso: true, genero: result.rows[0] });
    } catch (error) {
        console.error('Erro ao obter genero:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor.' });
    }
};

// Criar genero
exports.criarGenero = async (req, res) => {
    try {
        const { id_genero, nome_genero } = req.body;
        const id = id_genero ? id_genero.trim().toUpperCase() : '';

        if (!nome_genero) {
            return res.status(400).json({ sucesso: false, mensagem: 'O nome do gênero é obrigatório.' });
        }

        const sql = `
            INSERT INTO generos (id_genero, nome_genero)
            VALUES ($1, $2)
            RETURNING *
        `;

        const result = await query(sql, [id, nome_genero]);
        res.status(201).json({ sucesso: true, mensagem: 'Genero inserido com sucesso!', genero: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar genero:', error);
        if (error.code === '23505') {
            return res.status(400).json({ sucesso: false, mensagem: 'Este ID já está cadastrada.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao inserir genero no banco de dados.' });
    }
};

// Atualizar genero
exports.atualizarGenero = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';
        const { nome_genero } = req.body;

        const sql = `
            UPDATE generos 
            SET nome_genero = $1 
            WHERE id_genero = $2
            RETURNING *
        `;

        const result = await query(sql, [nome_genero, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ sucesso: false, mensagem: 'Genero não encontrado.' });
        }

        res.json({ sucesso: true, mensagem: 'Genero alterado com sucesso!', genero: result.rows[0] });
    } catch (error) {
        console.error('Erro ao atualizar genero:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar genero.' });
    }
};

// Deletar genero
exports.deletarGenero = async (req, res) => {
    try {
        const id = req.params.id ? req.params.id.trim().toUpperCase() : '';

        await query('DELETE FROM generos WHERE id_genero = $1', [id]);

        res.json({ sucesso: true, mensagem: 'genero excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar genero:', error);
        if (error.code === '23503') {
            return res.status(400).json({ sucesso: false, mensagem: 'Não é possível excluir: existem livros associados a este genero.' });
        }
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir genero.' });
    }
};