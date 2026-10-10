console.log("===== PARTE 1: MANIPULAÇÃO E VALIDAÇÃO DE DADOS =====");

// Array de objetos representando pedidos
const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Carlos", valor: 80, status: "pendente" },
    { cliente: "Ana", valor: 200, status: "pago" },
    { cliente: " ", valor: 50, status: "pago" },
    { cliente: "João", valor: -10, status: "pago" },
    { cliente: "Marina", valor: "abc", status: "pago" }
];

// Valida os pedidos: cliente preenchido e valor numérico maior que zero
const pedidosValidos = pedidos.filter(function(pedido) {
    return (
        typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "" &&
        typeof pedido.valor === "number" &&
        Number.isFinite(pedido.valor) &&
        pedido.valor > 0
    );
});

console.log("Pedidos válidos:", pedidosValidos);

// Filtra os pedidos válidos que estão pagos
const pedidosPagos = pedidosValidos.filter(function(pedido) {
    return pedido.status === "pago";
});

console.log("Pedidos pagos:", pedidosPagos);

// Soma o faturamento dos pedidos pagos
const totalFaturado = pedidosPagos.reduce(function(total, pedido) {
    return total + pedido.valor;
}, 0);

console.log("Total faturado: R$", totalFaturado.toFixed(2));

// Cria textos no formato solicitado
const resumoPedidos = pedidosPagos.map(function(pedido) {
    return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Resumo dos pedidos:", resumoPedidos);


// ===== PARTE 2: BUSCADOR DE CEP =====

const formularioCep = document.querySelector("#formulario-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCeps = document.querySelector("#historico-ceps");

// Array de objetos para armazenar o histórico durante a sessão
const historico = [];

function mostrarStatusCep(mensagem) {
    statusCep.textContent = mensagem;
}

function criarCampoResultado(rotulo, valor) {
    const dt = document.createElement("dt");
    dt.textContent = rotulo;

    const dd = document.createElement("dd");
    dd.textContent = valor || "Não informado";

    resultadoCep.append(dt, dd);
}

function atualizarHistorico(cep, endereco) {
    historico.push({
        cep: cep,
        endereco: endereco
    });

    historicoCeps.replaceChildren();

    historico.forEach(function(item) {
        const li = document.createElement("li");
        li.textContent =
            `${item.cep} — ${item.endereco.localidade}/${item.endereco.uf}`;

        historicoCeps.append(li);
    });
}

formularioCep.addEventListener("submit", async function(e) {
    e.preventDefault();

    const cepDigitado = campoCep.value.trim();

    // Valida se o CEP possui exatamente 8 dígitos
    if (!/^\d{8}$/.test(cepDigitado)) {
        resultadoCep.replaceChildren();
        mostrarStatusCep("Digite um CEP válido com 8 dígitos.");
        return;
    }

    botaoCep.disabled = true;
    resultadoCep.replaceChildren();
    mostrarStatusCep("Buscando...");

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cepDigitado}/json/`,
            { signal: AbortSignal.timeout(5000) }
        );

        // Fetch não rejeita automaticamente em erros HTTP
        if (!resposta.ok) {
            throw new Error("Falha na conexão.");
        }

        const dados = await resposta.json();

        // CEP inexistente
        if (dados.erro) {
            mostrarStatusCep("CEP não encontrado.");
            return;
        }

        // Exibe os dados do endereço
        resultadoCep.replaceChildren();

        criarCampoResultado("Rua:", dados.logradouro);
        criarCampoResultado("Bairro:", dados.bairro);
        criarCampoResultado("Cidade:", dados.localidade);
        criarCampoResultado("UF:", dados.uf);

        mostrarStatusCep("");

        // Registra a pesquisa no histórico
        atualizarHistorico(cepDigitado, dados);

    } catch (erro) {
        console.error("Erro ao consultar CEP:", erro);
        resultadoCep.replaceChildren();

        if (erro.name === "TimeoutError") {
            mostrarStatusCep("A consulta demorou demais. Tente novamente.");
        } else {
            mostrarStatusCep("Falha na conexão. Verifique sua internet e tente novamente.");
        }
    } finally {
        botaoCep.disabled = false;
    }
});


// ===== PARTE 3: MINI POKÉDEX =====

const formularioPokemon = document.querySelector("#formulario-pokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#botao-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

formularioPokemon.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nomePokemon = campoPokemon.value.trim().toLowerCase();

    // Valida se o nome não está vazio
    if (nomePokemon === "") {
        resultadoPokemon.replaceChildren();
        statusPokemon.textContent = "Digite o nome de um Pokémon.";
        return;
    }

    botaoPokemon.disabled = true;
    resultadoPokemon.replaceChildren();
    statusPokemon.textContent = "Buscando Pokémon...";

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nomePokemon)}`,
            { signal: AbortSignal.timeout(5000) }
        );

        // Verifica erros HTTP, incluindo 404
        if (resposta.status === 404) {
            throw new Error("NOT_FOUND");
        }

        if (!resposta.ok) {
            throw new Error("CONNECTION");
        }

        const dados = await resposta.json();

        // Cria o nome
        const titulo = document.createElement("h3");
        titulo.textContent =
            dados.name.charAt(0).toUpperCase() + dados.name.slice(1);

        // Cria a imagem
        const imagem = document.createElement("img");
        imagem.alt = `Imagem de ${dados.name}`;
        imagem.src = dados.sprites.front_default || "";
        
        if (!dados.sprites.front_default) {
            imagem.alt = "Imagem não disponível";
        }

        // Cria a lista de tipos
        const tituloTipos = document.createElement("h4");
        tituloTipos.textContent = "Tipos:";

        const listaTipos = document.createElement("ul");

        dados.types.forEach(function(item) {
            const li = document.createElement("li");
            li.textContent = item.type.name;
            listaTipos.append(li);
        });

        // Insere os elementos na página
        resultadoPokemon.replaceChildren(
            titulo,
            imagem,
            tituloTipos,
            listaTipos
        );

        statusPokemon.textContent = "";

    } catch (erro) {
        console.error("Erro ao consultar Pokémon:", erro);
        resultadoPokemon.replaceChildren();

        if (erro.message === "NOT_FOUND") {
            statusPokemon.textContent = "Pokémon não encontrado.";
        } else if (erro.name === "TimeoutError") {
            statusPokemon.textContent = "A consulta demorou demais. Tente novamente.";
        } else {
            statusPokemon.textContent =
                "Falha na conexão. Verifique sua internet e tente novamente.";
        }
    } finally {
        botaoPokemon.disabled = false;
    }
});

console.log("===== PROJETO CARREGADO COM SUCESSO =====");
