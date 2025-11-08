# Korp ERP - Projeto Técnico: Sistema de Emissão de Notas Fiscais

Este projeto é uma solução Full-Stack desenvolvida como parte de um desafio técnico. Ele implementa um sistema de gerenciamento de produtos e emissão de notas fiscais, seguindo uma arquitetura de microsserviços.

## 🚀 Tecnologias Utilizadas

* **Backend:** C# 10, .NET 6, ASP.NET Core Web API
* **Frontend:** Angular 17+, TypeScript
* **Padrões:** API REST, Injeção de Dependência (DI), Formulários Reativos, Monorepo

## 📁 Estrutura do Projeto

Este repositório é um **Monorepo** contendo dois projetos principais:

* `/backend`: A solução .NET (C#) contendo os dois microsserviços.
* `/frontend`: O projeto Angular (SPA).

## ⚡ Como Executar o Projeto

Para rodar este projeto, ambos os microsserviços de backend e o frontend devem estar em execução simultaneamente.

### 1. Backend (C#)

1.  Abra o Visual Studio 2022.
2.  Abra o arquivo de solução: `/backend/Korp_Teste_DarioForteFranco.sln`.
3.  Certifique-se de que a solução está configurada para **"Vários projetos de inicialização"** (tanto o `ServicoEstoque` quanto o `ServicoFaturamento`).
4.  Pressione **F5** para iniciar os dois microsserviços.

### 2. Frontend (Angular)

1.  Abra a pasta `/frontend` no VS Code.
2.  No terminal, instale as dependências (necessário apenas na primeira vez): `npm install`
3.  Inicie o servidor de desenvolvimento: `ng serve --open`
4.  O aplicativo será aberto em `http://localhost:4200`.

---

## 🔧 Detalhamento Técnico

Este detalhamento responde aos requisitos técnicos solicitados no documento do desafio.

### Backend (C# / .NET)

* **Frameworks Utilizados**: A solução foi construída usando **ASP.NET Core** para a criação dos endpoints da API REST. A simulação do banco de dados foi feita usando listas estáticas (`static List<>`) para persistir os dados em memória durante a execução.

* **Tratamento de Erros e Exceções**: O tratamento de falhas foi implementado seguindo as melhores práticas do ASP.NET Core:
    * **Validação de Negócio:** Em vez de gerar exceções, o sistema retorna respostas HTTP semânticas. Por exemplo, ao tentar imprimir uma nota com estoque insuficiente, o `ServicoFaturamento` recebe um `400 Bad Request` do `ServicoEstoque` e o repassa ao frontend.
    * **Prevenção de Exceção (LINQ):** Conforme detalhado abaixo.

* **Uso de LINQ**: O LINQ foi utilizado extensivamente para consultar as listas em memória. Foi adotada uma abordagem de **prevenção de exceção** ao optar pelo método **`.FirstOrDefault()`** em vez de `.First()`. Isso nos permite verificar se o resultado é `null` (ex: `if (produto == null)`) e retornar um `404 NotFound()`, evitando um `InvalidOperationException` e a necessidade de blocos `try-catch` desnecessários.

### Frontend (Angular)

* **Ciclos de Vida do Angular**: Foi utilizado o ciclo de vida **`ngOnInit()`** nos componentes de listagem (`lista-notas` e `lista-produtos`) e no `detalhe-nota`. Este hook é ideal para buscar dados (data fetching) assim que o componente é inicializado, garantindo que os dados da API estejam prontos para serem exibidos.

* **Uso da Biblioteca RxJS**: O RxJS é o coração do `HttpClient` do Angular. Utilizamos o método **`.subscribe()`** para lidar com os *Observables* retornados pelos serviços. A lógica de `next:` (para casos de sucesso) e `error:` (para casos de falha) foi usada em todos os componentes para dar feedback ao usuário (como `alert()`) e atualizar a UI.

* **Outras Bibliotecas**:
    * **`ReactiveFormsModule`**: Foi a biblioteca central para a criação de formulários. Usamos `FormGroup` e `FormControl` (no cadastro de produtos) e o **`FormArray`** (para o cadastro dinâmico de múltiplos itens na nota fiscal).
    * **`HttpClientModule`**: Registrado via `provideHttpClient()`, foi usado para criar os serviços (`ProdutoService`, `NotaFiscalService`) que consomem a API C#.
    * **`RouterModule`**: Usado para criar a SPA com navegação limpa, incluindo rotas parametrizadas (ex: `/notas/:id`) e redirecionamento.

---

## ✨ Requisitos Opcionais (Idempotência)

O projeto implementa **Idempotência** no endpoint de impressão de nota.

* **Definição:** Garantir que uma operação repetida não cause efeitos colatareis indesejados.
* **Implementação:** O endpoint `POST .../imprimir` verifica obrigatoriamente se o status da nota é **"Aberta"**.
    * Na **1ª chamada**, a nota está "Aberta", o estoque é debitado e o status muda para "Fechada".
    * Na **2ª chamada** (e em todas as seguintes), o `if` inicial falha, e a API retorna um `BadRequest` **antes** de tentar debitar o estoque novamente. Isso garante que o estoque só seja debitado uma única vez, mesmo com múltiplas requisições.