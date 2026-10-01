const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importa a função de consulta do banco
const { query } = require('./database');

// Importa as rotas
const cargoRoutes = require('./routes/cargoRoutes');
const generoRoutes = require('./routes/generoRoutes');
const livroRoutes = require('./routes/livroRoutes');
const pessoaRoutes = require('./routes/pessoaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Servir imagens estáticas
app.use('/imagens', express.static(path.join(__dirname, '../imagens')));

// Definir Rotas
app.use('/cargo', cargoRoutes);
app.use('/genero', generoRoutes);
app.use('/livro', livroRoutes);
app.use('/pessoa', pessoaRoutes);
app.use('/cliente', clienteRoutes);
app.use('/funcionario', funcionarioRoutes);


const PORT = process.env.PORT || 3001;

// Inicializa o servidor e testa o PostgreSQL
app.listen(PORT, async () => {
    console.log(`\n=================================`);
    console.log(`🚀 Servidor executando na porta ${PORT}`);
    
    try {
        await query('SELECT 1');
        console.log(`✅ Banco de Dados conectado com sucesso!`);
    } catch (error) {
        console.error(`❌ FALHA NA CONEXÃO COM O BANCO DE DADOS:`);
        console.error(`   Motivo: ${error.message}`);
        console.error(`👉 Ajuste o arquivo .env com a senha correta do seu PostgreSQL.`);
    }
    console.log(`=================================\n`);
});