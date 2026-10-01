DROP TABLE IF EXISTS LIVROS, GENEROS, FUNCIONARIOS, CARGOS, CLIENTES, PESSOAS;
CREATE TABLE PESSOAS(
       cpf_pessoa INTEGER PRIMARY KEY,
	   nome_pessoa VARCHAR(100),
	   data_nascimento_pessoa DATE,
	   endereco_pessoa VARCHAR(150),
	   senha_pessoa VARCHAR(50),
	   email_pessoa VARCHAR(75)
);

CREATE TABLE CLIENTES(
       cpf_pessoa INTEGER PRIMARY KEY,
	   data_cadastro DATE,
	   renda_cliente DECIMAL (10, 2),
	   FOREIGN KEY(cpf_pessoa) REFERENCES PESSOAS(cpf_pessoa)
);

CREATE TABLE CARGOS(
       id_cargo INTEGER PRIMARY KEY,
	   nome_cargo VARCHAR(100)
);

CREATE TABLE FUNCIONARIOS(
       cpf_pessoa INTEGER PRIMARY KEY,
	   id_cargo INTEGER,
	   salario DECIMAL (10, 2),
	   porcentagem_comissao_funcionario DECIMAL(5,2),
	   FOREIGN KEY(cpf_pessoa) REFERENCES PESSOAS(cpf_pessoa),
	   FOREIGN KEY(id_cargo) REFERENCES CARGOS(id_cargo)
);

CREATE TABLE GENEROS(
       id_genero INTEGER PRIMARY KEY,
	   nome_genero VARCHAR(100)
);

CREATE TABLE LIVROS(
       id_livro INTEGER PRIMARY KEY,
	   nome_livro VARCHAR(100),
	   autor VARCHAR(100),
	   preco DECIMAL(10,2),
	   numero_paginas INTEGER,
	   id_genero INTEGER,
	   FOREIGN KEY(id_genero) REFERENCES GENEROS(id_genero)
);

INSERT INTO PESSOAS(cpf_pessoa, nome_pessoa, data_nascimento_pessoa, endereco_pessoa, senha_pessoa, email_pessoa)
VALUES
(1001, 'Ana Souza', '1995-03-15', 'Rua das Flores, 120', 'ana123', 'ana.souza@email.com'),
(1002, 'Lucas Oliveira', '1998-07-22', 'Avenida Brasil, 450', 'lucas123', 'lucas.oliveira@email.com'),
(1003, 'Mariana Santos', '1992-11-10', 'Rua Paraná, 85', 'mariana123', 'mariana.santos@email.com'),
(1004, 'Pedro Almeida', '1988-05-18', 'Rua São Paulo, 210', 'pedro123', 'pedro.almeida@email.com'),
(1005, 'Julia Martins', '2000-01-25', 'Avenida Curitiba, 320', 'julia123', 'julia.martins@email.com'),
(1006, 'Carlos Mendes', '1985-09-30', 'Rua das Palmeiras, 75', 'carlos123', 'carlos.mendes@email.com'),
(1007, 'Beatriz Ferreira', '1997-04-12', 'Rua Brasil, 190', 'bia123', 'beatriz.ferreira@email.com'),
(1008, 'Rafael Costa', '1990-08-27', 'Avenida Paraná, 560', 'rafa123', 'rafael.costa@email.com'),
(1009, 'Camila Rodrigues', '1999-12-05', 'Rua das Acácias, 44', 'camila123', 'camila.rodrigues@email.com'),
(1010, 'Gabriel Lima', '1994-06-19', 'Rua XV de Novembro, 300', 'gabriel123', 'gabriel.lima@email.com');

INSERT INTO CARGOS(id_cargo, nome_cargo)
VALUES
(1, 'Gerente'),
(2, 'Atendente'),
(3, 'Caixa'),
(4, 'Vendedor'),
(5, 'Supervisor'),
(6, 'Estoquista'),
(7, 'Auxiliar Administrativo'),
(8, 'Bibliotecário'),
(9, 'Assistente de Vendas'),
(10, 'Coordenador');

INSERT INTO CLIENTES(cpf_pessoa, data_cadastro, renda_cliente)
VALUES
(1001, '2026-09-01', 3500.00),
(1002, '2026-09-02', 4200.50),
(1003, '2026-09-03', 2800.00),
(1004, '2026-09-04', 5100.75),
(1007, '2026-09-08', 3200.00),
(1008, '2026-09-09', 4600.25),
(1009, '2026-09-10', 3900.00),
(1005, '2026-09-11', 3700.00),
(1006, '2026-09-12', 4300.00),
(1010, '2026-09-13', 5200.00);

INSERT INTO FUNCIONARIOS(cpf_pessoa, id_cargo, salario, porcentagem_comissao_funcionario)
VALUES
(1005, 1, 4800.00, 5.00),
(1006, 2, 3200.00, 2.00),
(1007, 4, 3000.00, 4.00),
(1008, 3, 2900.00, 2.50),
(1010, 5, 5500.00, 6.50),
(1001, 6, 2600.00, 1.00),
(1002, 7, 3100.00, 0.00),
(1003, 8, 3400.00, 2.00),
(1004, 9, 2800.00, 3.50),
(1009, 10, 5000.00, 4.00);

INSERT INTO GENEROS (id_genero, nome_genero) 
VALUES (1, 'Romance'),
       (2, 'Fantasia'),
	   (3, 'Ficção Científica'),
	   (4, 'Mistério'),
	   (5, 'Aventura'),
	   (6, 'Distopia'),
	   (7, 'Terror'),
	   (8, 'Biografia'),
	   (9, 'Poesia'),
	   (10, 'Crônica');

INSERT INTO LIVROS (id_livro, nome_livro, autor, preco, numero_paginas, id_genero) 
VALUES (1, 'Orgulho e Preconceito', 'Jane Austen', 39.90, 424, 1),
       (2, 'O Hobbit', 'J.R.R. Tolkien', 49.90, 310, 2),
	   (3, 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', 44.90, 264, 2),
	   (4, 'Jogos Vorazes', 'Suzanne Collins', 42.90, 400, 6),
	   (5, 'O Assassinato no Expresso do Oriente', 'Agatha Christie', 35.90, 240, 4),
	   (6, 'O Guia do Mochileiro das Galáxias', 'Douglas Adams', 38.90, 208, 3),
	   (7, 'As Crônicas de Nárnia', 'C.S. Lewis', 59.90, 752, 5),
	   (8, 'A Culpa é das Estrelas', 'John Green', 34.90, 288, 1),
	   (9, 'Anne de Green Gables', 'L.M Montegomery', 29.90, 410, 1),
	   (10, 'O Diário de Anne Frank', 'Anne Frank', 42.90, 352, 8);