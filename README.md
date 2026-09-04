<img src="https://img.shields.io/static/v1?label=license&message=MIT&color=5965E0&labelColor=121214" alt="License"> <img src="https://img.shields.io/badge/Angular_22-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" /> <img src="https://img.shields.io/badge/Native_Federation-4B32C3?style=for-the-badge" alt="Native Federation" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /> <img src="https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=rxjs&logoColor=white" alt="RxJS" /> <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />

# CryptoTracker MFE

O **CryptoTracker MFE** é uma aplicação para visualização e acompanhamento de criptomoedas, estruturada como **microfrontends**: um shell orquestra três aplicações independentes (mercado, análise e watchlist), carregadas em runtime via **Native Federation**, consumindo a API pública da [Coinranking](https://coinranking.com/) para exibir cotações, gráficos e uma watchlist pessoal.

![Mercado](./docs/market.png)

---

## Stack 🚀

**Frontend**

- **Angular (v22)** — standalone, signals, zoneless
- **Native Federation** — composição dos microfrontends em runtime
- **TypeScript (v6)**
- **RxJS**
- **SCSS** com design tokens próprios
- **Vitest**

**API (Externa)**

- **Coinranking API**

---

## Configuração de Ambiente 🔐

Antes de rodar o projeto, é necessário configurar o seu token da API da Coinranking:

1. Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
2. Abra o arquivo `.env` e insira sua chave da API:

   ```env
   COINRANKING_API_KEY=seu_token_real_aqui
   ```

   _(O arquivo `.env` não é enviado ao GitHub por segurança)._

Os environments de cada microfrontend são gerados a partir do `.env`.

---

## Rodando Localmente ⚡️

Existem duas maneiras de rodar o projeto: **manualmente** ou com **Docker**.

### Manualmente ⚒️

Node 22 ou superior.

1. Clone o repositório:

   ```bash
   git clone https://github.com/dev-araujo/crypto-tracker-mfe.git
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute os servidores de desenvolvimento:

   ```bash
   npm start
   ```

   _Obs: O comando `npm start` gera os environments e o manifest de federação a partir do seu `.env` antes de subir as quatro aplicações._

⭐ A aplicação estará disponível em `http://localhost:4200`.

Para subir um microfrontend isolado: `npm run start:market` (ou `start:analytics`, `start:watchlist`, `start:shell`).

Outros scripts: `npm run build` (build de produção) e `npm test` (suíte Vitest).

### Com Docker 🐋

#### 📋 Pré-requisitos

Certifique-se de que você tem o [Docker](https://www.docker.com/get-started) e o [Docker Compose](https://docs.docker.com/compose/install/) instalados.

1. Clone o repositório:

   ```bash
   git clone https://github.com/dev-araujo/crypto-tracker-mfe.git
   ```

2. Execute o Docker Compose para construir as imagens e iniciar os contêineres:

   ```bash
   docker compose up --build
   ```

⭐ A aplicação estará disponível em `http://localhost:4200`.

---

#### Autor 👷

<img src="https://avatars.githubusercontent.com/u/97068163?v=4" width=120 />

[Adriano P Araujo](https://www.linkedin.com/in/araujocode/)
