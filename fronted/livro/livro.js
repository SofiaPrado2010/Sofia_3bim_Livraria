const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let livro = null;
bloquearAtributos(true);

async function inicializar() {
    await carregarGeneros();
    await listar();
}

async function carregarGeneros() {
    const select = document.getElementById("selectId_genero");
    try {
        const resposta = await fetch(`${URL_API}/genero/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            select.innerHTML = '<option value="">-- Selecione um Gênero --</option>';
            data.generos.forEach(um => {
                select.innerHTML += `<option value="${um.id_genero}">${um.id_genero} - ${um.nome_genero}</option>`;
            });
        }
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar generos</option>';
    }
}

function carregarImagem(id) {
    const img = document.getElementById('imglivro');
    if (!id) {
        img.src = SILHUETA_URL;
        return;
    }
    img.src = `${URL_API}/imagens/${id}.png?t=${new Date().getTime()}`;
    img.onerror = () => { img.src = SILHUETA_URL; };
}

function acionarUpload() {
    if (oQueEstaFazendo !== 'inserindo' && oQueEstaFazendo !== 'alterando') {
        mostrarAviso("Clique em Inserir ou Alterar primeiro para poder escolher uma imagem.");
        return;
    }
    document.getElementById('inputImagem').click();
}

function previewImagem() {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length > 0) {
        const url = URL.createObjectURL(inputFiles[0]);
        document.getElementById('imglivro').src = url;
        mostrarAviso("Imagem escolhida! Clique em Salvar para concluir.");
    }
}

async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return;

    const formData = new FormData();
    formData.append('imagem', inputFiles[0]);

    try {
        await fetch(`${URL_API}/livro/upload/${id}`, {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/livro/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.livro : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_livro = document.getElementById("inputId_livro").value;
    if (isNaN(id_livro) || !Number.isInteger(Number(id_livro)) || id_livro === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    livro = await procurePorChavePrimaria(id_livro);
    oQueEstaFazendo = '';
    
    if (livro) {
        mostrarDadosLivro(livro);
        carregarImagem(id_livro);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        carregarImagem(null);
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos, escolha a imagem e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos, mude a imagem (opcional) e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_livro = document.getElementById("inputId_livro").value;
    const nome_livro = document.getElementById("inputNome_livro").value;
    const id_genero = document.getElementById("selectId_genero").value || null;
    const autor = document.getElementById("inputAutor").value;
    const preco = parseFloat(document.getElementById("inputPreco").value) || 0.0;
    const numero_paginas = parseInt(document.getElementById("inputPaginas").value) || 0;

    const dadosLivro = { id_livro, nome_livro, id_genero, autor, preco, numero_paginas };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/livro`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosLivro) });
            await uploadImagemParaServidor(id_livro);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/livro/${id_livro}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosLivro) });
            await uploadImagemParaServidor(id_livro);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/livro/${id_livro}`, { method: 'DELETE' });
            carregarImagem(null);
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_livro").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/livro/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.livros) {
                const um = linha.id_genero ? ` [${linha.id_genero}]` : '';
                texto += `${linha.id_livro} - ${linha.nome_livro}${um} - Autor: ${linha.autor} - Preço: R$ ${parseFloat(linha.preco).toFixed(2)} - Páginas: ${linha.numero_paginas}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum livro cadastrado.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();
    carregarImagem(null);
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosLivro(l) {
    document.getElementById("inputId_livro").value = l.id_livro;
    document.getElementById("inputNome_livro").value = l.nome_livro;
    document.getElementById("selectId_genero").value = l.id_genero || "";
    document.getElementById("inputAutor").value = l.autor;
    document.getElementById("inputPreco").value = l.preco;
    document.getElementById("inputPaginas").value = l.numero_paginas;
    bloquearAtributos(true);
}

function limparAtributos() {
    livro = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_livro").value = "";
    document.getElementById("selectId_genero").value = "";
    document.getElementById("inputAutor").value = "";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputPaginas").value = "";
    document.getElementById("inputImagem").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_livro").readOnly = !soLeitura;
    document.getElementById("inputNome_livro").readOnly = soLeitura;
    document.getElementById("selectId_genero").disabled = soLeitura;
    document.getElementById("inputAutor").readOnly = soLeitura;
    document.getElementById("inputPreco").readOnly = soLeitura;
    document.getElementById("inputPaginas").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}