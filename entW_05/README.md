# Objetos, Dados e Assincronismo — Semana 05

## Sobre o projeto

Projeto desenvolvido para praticar manipulação de objetos e arrays, validação de dados, consumo de APIs e atualização dinâmica do DOM com JavaScript.

## Tecnologias utilizadas

- HTML5
- JavaScript
- Fetch API
- Promises e async/await
- DOM
- ViaCEP API
- PokéAPI

## Parte 1 — Manipulação e validação de dados

Foi criado um array de objetos `pedidos`, contendo cliente, valor e status.

Os pedidos são validados para garantir que o cliente não esteja vazio e que o valor seja numérico e maior que zero.

Depois, são filtrados os pedidos com status "pago". O método `reduce()` calcula o total faturado, enquanto `map()` gera textos com os nomes dos clientes e valores formatados com `toFixed(2)`.

## Parte 2 — Buscador de CEP

O buscador utiliza a API ViaCEP para consultar endereços a partir de um CEP.

Funcionalidades:
- Validação de CEP com oito dígitos.
- Consulta utilizando `fetch()` e `async/await`.
- Exibição de rua, bairro, cidade e UF.
- Tratamento de carregamento, erro, CEP não encontrado e sucesso.
- Histórico de pesquisas armazenado em um array de objetos.
- Timeout de cinco segundos para evitar esperas excessivas.

## Parte 3 — Mini Pokédex

A Mini Pokédex utiliza a PokéAPI para consultar Pokémon pelo nome.

Funcionalidades:
- Validação do campo de busca.
- Conversão do nome para letras minúsculas.
- Exibição do nome, imagem e tipos do Pokémon.
- Tratamento de carregamento, erros de conexão, Pokémon não encontrado e sucesso.

## Parte 4 — Reflexão sobre Promise.all()

O `Promise.all()` pode ser mais rápido que vários `await` seguidos quando as operações são independentes.

Com `await` sequencial, cada operação espera a anterior terminar antes de começar a próxima. Já com `Promise.all()`, as Promises podem ser iniciadas antes de aguardarmos seus resultados, permitindo que as requisições ocorram em paralelo.

Por exemplo, se precisarmos consultar três APIs independentes, podemos iniciar as três requisições e aguardar todas com `Promise.all()`. Assim, o tempo total tende a ser menor, pois não precisamos esperar cada requisição terminar para iniciar a seguinte.

É importante lembrar que `Promise.all()` rejeita se alguma das Promises rejeitar, a menos que os erros sejam tratados individualmente.

## Como executar

1. Clone ou baixe este repositório.
2. Abra a pasta no VS Code.
3. Execute o arquivo `index.html` usando o navegador ou a extensão Live Server.
4. Utilize o Console do navegador (F12) para verificar as mensagens.
5. Teste o buscador de CEP e a Mini Pokédex com uma conexão à internet.

## Estrutura dos arquivos

- `index.html`: estrutura da página.
- `app.js`: validações, consultas às APIs e manipulação do DOM.
- `README.md`: documentação do projeto.

## Autora

Sarah Pessoa

Estudante de Análise e Desenvolvimento de Sistemas.
