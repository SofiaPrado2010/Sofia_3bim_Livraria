const URL_API = 'http://localhost:3001';

let oQueEstaFazendo = '';
let genero = null;
bloquearAtributos(true);

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/genero/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.genero : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_genero = document.getElementById("inputId_genero").value.trim().toUpperCase();
    if (isNaN(id_genero) ) {
        mostrarAviso("O ID deve ser um número");
        return;
    }

    document.getElementById("inputId_genero").value = id_genero;
    genero = await procurePorChavePrimaria(id_genero);
    oQueEstaFazendo = '';
    
    if (genero) {
        mostrarDadosGenero(genero);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite o nome do genero e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite o novo nome e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    const id_genero = document.getElementById("inputId_genero").value.trim().toUpperCase();
    const nome_genero = document.getElementById("inputNome_genero").value;

    const dadosGenero = { id_genero, nome_genero };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            const resp = await fetch(`${URL_API}/genero`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosGenero) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            const resp = await fetch(`${URL_API}/genero/${id_genero}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosGenero) });
            const data = await resp.json();
            if (!data.sucesso) return mostrarAviso(data.mensagem);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            const resposta = await fetch(`${URL_API}/genero/${id_genero}`, { method: 'DELETE' });
            const data = await resposta.json();
            if (!data.sucesso) {
                mostrarAviso(data.mensagem || "Erro ao excluir no servidor.");
                return;
            }
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_genero").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/genero/listar`);
        const data = await resposta.json();
        
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.generos) {
                texto += `<b>[${linha.id_genero}]</b> - ${linha.nome_genero}<br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum genero cadastrado.";
        } else {
            document.getElementById("outputSaida").innerHTML = `Erro no banco: ${data.mensagem}`;
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
        document.getElementById("outputSaida").innerHTML = "Servidor offline ou erro de conexão (CORS).";
    }
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadosGenero(g) {
    document.getElementById("inputId_genero").value = g.id_genero;
    document.getElementById("inputNome_genero").value = g.nome_genero;
    bloquearAtributos(true);
}

function limparAtributos() {
    genero = null;
    oQueEstaFazendo = '';
    document.getElementById("inputNome_genero").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_genero").readOnly = !soLeitura;
    document.getElementById("inputNome_genero").readOnly = soLeitura;
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}