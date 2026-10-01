# 📚 Livraria — Sistema de Gerenciamento

## 1. Sobre o projeto

O projeto **Livraria** é uma aplicação web desenvolvida como parte da disciplina de Desenvolvimento Web I (DW1). Seu objetivo é permitir o gerenciamento de informações de uma livraria, utilizando uma arquitetura cliente-servidor e um banco de dados relacional.

A aplicação utiliza tecnologias de desenvolvimento web no frontend, Node.js e Express no backend e PostgreSQL para o armazenamento dos dados.

## 2. Funcionalidades

* Gerenciamento de pessoas, clientes e funcionários.
* Cadastro e consulta de cargos.
* Gerenciamento de gêneros literários.
* Cadastro e consulta de livros.
* Organização dos dados por meio de um banco de dados relacional.
* Comunicação entre frontend e backend por meio de requisições HTTP.

## 3. Tecnologias utilizadas

| Tecnologia | Finalidade                                    |
| ---------- | --------------------------------------------- |
| HTML5      | Estruturação das páginas                      |
| CSS3       | Estilização e layout                          |
| JavaScript | Interatividade e comunicação com o servidor   |
| Node.js    | Execução do backend                           |
| Express    | Criação do servidor e gerenciamento das rotas |
| PostgreSQL | Banco de dados relacional                     |
| CORS       | Permissão de comunicação entre origens        |
| dotenv     | Gerenciamento de variáveis de ambiente        |
| pg         | Conexão com o PostgreSQL                      |
| Multer     | Processamento de arquivos enviados            |
| Sharp      | Processamento de imagens                      |

## 4. Estrutura do banco de dados

O banco de dados é composto por seis tabelas: `PESSOAS`, `CLIENTES`, `FUNCIONARIOS`, `CARGOS`, `GENEROS` e `LIVROS`.

### Diagrama do banco de dados

**Relacionamentos:**

* `PESSOAS` → `CLIENTES`: uma pessoa pode estar cadastrada como cliente.
* `PESSOAS` → `FUNCIONARIOS`: uma pessoa pode estar cadastrada como funcionária.
* `CARGOS` → `FUNCIONARIOS`: um cargo pode estar associado a vários funcionários.
* `GENEROS` → `LIVROS`: um gênero pode estar associado a vários livros.

```text
                 ┌──────────────────┐
                 │      PESSOAS     │
                 ├──────────────────┤
                 │ PK cpf_pessoa    │
                 │ nome_pessoa      │
                 │ data_nascimento  │
                 │ endereco_pessoa  │
                 │ senha_pessoa     │
                 │ email_pessoa     │
                 └────────┬─────────┘
                          │
               ┌──────────┴──────────┐
               │                     │
       ┌───────▼────────┐   ┌────────▼─────────┐
       │    CLIENTES    │   │   FUNCIONARIOS   │
       ├────────────────┤   ├──────────────────┤
       │ PK,FK cpf      │   │ PK,FK cpf_pessoa │
       │ data_cadastro  │   │ FK id_cargo      │
       │ renda_cliente  │   │ salario          │
       └────────────────┘   │ porcentagem_com. │
                            └────────┬─────────┘
                                     │
                            ┌────────▼─────────┐
                            │      CARGOS      │
                            ├──────────────────┤
                            │ PK id_cargo      │
                            │ nome_cargo       │
                            └──────────────────┘

       ┌────────────────┐      ┌────────────────┐
       │    GENEROS     │      │     LIVROS     │
       ├────────────────┤      ├────────────────┤
       │ PK id_genero   │◄─────│ FK id_genero   │
       │ nome_genero    │  1:N │ PK id_livro    │
       └────────────────┘      │ nome_livro     │
                               │ autor          │
                               │ preco          │
                               │ numero_paginas │
                               └────────────────┘
```

### Descrição das tabelas

**PESSOAS**

Armazena as informações pessoais dos indivíduos cadastrados.

| Campo                  | Tipo         | Descrição               |
| ---------------------- | ------------ | ----------------------- |
| cpf_pessoa             | INTEGER (PK) | Identificador da pessoa |
| nome_pessoa            | VARCHAR(100) | Nome completo           |
| data_nascimento_pessoa | DATE         | Data de nascimento      |
| endereco_pessoa        | VARCHAR(150) | Endereço                |
| senha_pessoa           | VARCHAR(50)  | Senha cadastrada        |
| email_pessoa           | VARCHAR(75)  | E-mail                  |

**CLIENTES**

Armazena as informações específicas dos clientes, vinculadas à tabela `PESSOAS`.

| Campo         | Tipo             | Descrição                           |
| ------------- | ---------------- | ----------------------------------- |
| cpf_pessoa    | INTEGER (PK, FK) | Identificador e referência à pessoa |
| data_cadastro | DATE             | Data de cadastro                    |
| renda_cliente | DECIMAL(10,2)    | Renda do cliente                    |

**FUNCIONARIOS**

Armazena os dados profissionais dos funcionários.

| Campo                            | Tipo             | Descrição                           |
| -------------------------------- | ---------------- | ----------------------------------- |
| cpf_pessoa                       | INTEGER (PK, FK) | Identificador e referência à pessoa |
| id_cargo                         | INTEGER (FK)     | Cargo do funcionário                |
| salario                          | DECIMAL(10,2)    | Salário                             |
| porcentagem_comissao_funcionario | DECIMAL(5,2)     | Porcentagem de comissão             |

**CARGOS**

Armazena os cargos disponíveis na livraria.

| Campo      | Tipo         | Descrição              |
| ---------- | ------------ | ---------------------- |
| id_cargo   | INTEGER (PK) | Identificador do cargo |
| nome_cargo | VARCHAR(100) | Nome do cargo          |

**GENEROS**

Armazena os gêneros literários disponíveis.

| Campo       | Tipo         | Descrição               |
| ----------- | ------------ | ----------------------- |
| id_genero   | INTEGER (PK) | Identificador do gênero |
| nome_genero | VARCHAR(100) | Nome do gênero          |

**LIVROS**

Armazena as informações dos livros cadastrados.

| Campo          | Tipo          | Descrição              |
| -------------- | ------------- | ---------------------- |
| id_livro       | INTEGER (PK)  | Identificador do livro |
| nome_livro     | VARCHAR(100)  | Título do livro        |
| autor          | VARCHAR(100)  | Nome do autor          |
| preco          | DECIMAL(10,2) | Preço do livro         |
| numero_paginas | INTEGER       | Quantidade de páginas  |
| id_genero      | INTEGER (FK)  | Gênero literário       |

## 5. Estrutura de pastas

A estrutura geral pode ser descrita da seguinte forma, adaptando os nomes conforme a organização final dos arquivos:

* `backend/`

  * `server.js` — inicialização do servidor e registro das rotas.
  * `database.js` — conexão e consultas ao banco de dados.
  * `.env` — variáveis de configuração do ambiente.
  * `package.json` — dependências do projeto.
  * `routes/` — definição das rotas da API.
  * `controllers/` — lógica das operações e comunicação com o banco.
* `imagens/` — imagens utilizadas pela aplicação.
* Arquivos HTML, CSS e JavaScript do frontend.

## 6. Instalação e execução

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

* Node.js e npm.
* PostgreSQL.
* Visual Studio Code (ou outro editor de código).
* Uma ferramenta para executar comandos SQL, como o pgAdmin.

### 6.1. Configuração do banco de dados

1. Abra o PostgreSQL pelo pgAdmin.
2. Crie um banco de dados para o projeto.
3. Abra o Query Tool.
4. Execute o conteúdo do arquivo `dw1-db-livraria2.sql` para criar as tabelas e inserir os dados iniciais.

**Atenção:** o script utiliza `DROP TABLE IF EXISTS`, portanto, executá-lo novamente poderá apagar as tabelas e os dados existentes.

### 6.2. Configuração do backend

1. Abra o terminal na pasta que contém o `package.json` do backend.

2. Instale as dependências com:

   `npm install`

3. Crie o arquivo `.env` com as informações necessárias para a conexão com o PostgreSQL, seguindo os nomes de variáveis utilizados no arquivo `database.js`.

4. Confira se o banco de dados está em execução e se as credenciais estão corretas.

O arquivo `.env` não deve ser enviado ao GitHub, pois contém informações privadas de configuração.

### 6.3. Inicialização do servidor

Como o `package.json` fornecido não contém um script de inicialização, execute o servidor com:

`node server.js`

Por padrão, o backend utiliza a porta `3001`, podendo ser alterada pela variável `PORT` no ambiente.

Quando iniciado, o servidor informa no terminal se conseguiu se conectar ao PostgreSQL.

### 6.4. Execução do frontend

Abra os arquivos HTML do frontend utilizando a extensão Live Server do Visual Studio Code, se essa for a forma de execução adotada no projeto.

Mantenha o backend em execução para que o frontend consiga realizar as requisições à API.

## 7. Rotas da API

O backend disponibiliza as seguintes rotas principais:

| Rota               | Finalidade                                |
| ------------------ | ----------------------------------------- |
| `/pessoa`          | Gerenciamento de pessoas                  |
| `/cliente`         | Gerenciamento de clientes                 |
| `/funcionario`     | Gerenciamento de funcionários             |
| `/cargo`           | Gerenciamento de cargos                   |
| `/genero`          | Gerenciamento de gêneros literários       |
| `/livro`           | Gerenciamento de livros                   |
| `/imagens`         | Acesso aos arquivos de imagem             |

As rotas utilizam métodos HTTP, como `GET`, `POST`, `PUT` e `DELETE`, conforme as operações disponibilizadas em cada recurso.

## 8. Dependências

As dependências declaradas no `package.json` são:

* `cors`
* `dotenv`
* `express`
* `multer`
* `pg`
* `sharp`

Elas podem ser instaladas automaticamente executando `npm install` na pasta correspondente ao `package.json`.

## 9. Autoria

**Desenvolvedora:** Sofia
**Disciplina:** Desenvolvimento Web I (DW1)
**Projeto:** Livraria
**Ano:** 2026
