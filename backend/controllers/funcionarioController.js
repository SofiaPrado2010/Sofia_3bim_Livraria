const { query } = require('../database');
const path = require('path');

exports.abrirCrudFuncionario = (req, res) => {
  const usuario = req.cookies ? req.cookies.usuarioLogado : null;
  if (usuario) {
    res.sendFile(path.join(__dirname, '../../frontend/funcionario/funcionario.html'));
  } else {
    res.redirect('/login');
  }
};

exports.listarFuncionarios = async (req, res) => {
  try {
    const result = await query(
      'SELECT f.cpf_pessoa, p.nome_pessoa, f.salario, f.id_cargo, f.porcentagem_comissao_funcionario ' +
      'FROM funcionarios f, pessoas p WHERE f.cpf_pessoa = p.cpf_pessoa ORDER BY f.cpf_pessoa'
    );
    res.json({ sucesso: true, funcionarios: result.rows });
  } catch (error) {
    console.error('Erro ao listar funcionários:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.criarFuncionario = async (req, res) => {
  try {
    const { cpf_pessoa, salario, id_cargo, porcentagem_comissao_funcionario } = req.body;

    if (!salario) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O salário do funcionário é obrigatório'
      });
    }

    const result = await query(
      'INSERT INTO funcionarios (cpf_pessoa, salario, id_cargo, porcentagem_comissao_funcionario) VALUES ($1, $2, $3, $4) RETURNING *',
      [cpf_pessoa, salario, id_cargo, porcentagem_comissao_funcionario]
    );

    res.status(201).json({ sucesso: true, funcionario: result.rows[0] });
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);

    if (error.code === '23502') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados obrigatórios não fornecidos'
      });
    }

    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.obterFuncionario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ sucesso: false, mensagem: 'ID deve ser um número válido' });
    }

    const result = await query(
      'SELECT * FROM funcionarios WHERE cpf_pessoa = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Funcionário não encontrado' });
    }

    res.json({ sucesso: true, funcionario: result.rows[0] });
  } catch (error) {
    console.error('Erro ao obter funcionário:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.atualizarFuncionario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { salario, id_cargo, porcentagem_comissao_funcionario } = req.body;

    const existingPersonResult = await query(
      'SELECT * FROM funcionarios WHERE cpf_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Funcionário não encontrado' });
    }

    const currentFunc = existingPersonResult.rows[0];

    const updatedFields = {
      salario: salario !== undefined ? salario : currentFunc.salario,
      id_cargo: id_cargo !== undefined ? id_cargo : currentFunc.id_cargo,
      porcentagem_comissao_funcionario: porcentagem_comissao_funcionario !== undefined ? porcentagem_comissao_funcionario : currentFunc.porcentagem_comissao_funcionario
    };

    const updateResult = await query(
      'UPDATE funcionarios SET salario = $1, id_cargo = $2, porcentagem_comissao_funcionario = $3 WHERE cpf_pessoa = $4 RETURNING *',
      [updatedFields.salario, updatedFields.id_cargo, updatedFields.porcentagem_comissao_funcionario, id]
    );

    res.json({ sucesso: true, funcionario: updateResult.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};

exports.deletarFuncionario = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existingPersonResult = await query(
      'SELECT * FROM funcionarios WHERE cpf_pessoa = $1',
      [id]
    );

    if (existingPersonResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Funcionário não encontrado' });
    }

    await query(
      'DELETE FROM funcionarios WHERE cpf_pessoa = $1',
      [id]
    );

    res.json({ sucesso: true, mensagem: 'Funcionário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar funcionário:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Não é possível deletar funcionário com dependências associadas'
      });
    }

    res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
  }
};