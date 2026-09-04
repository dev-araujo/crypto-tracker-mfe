<img src="https://img.shields.io/badge/Angular_22-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" /> <img src="https://img.shields.io/badge/Native_Federation-4B32C3?style=for-the-badge" alt="Native Federation" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" /> <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />

# Cripto Angular · Microfrontends

Reconstrução do **crypto-tracker-angular** como um workspace de **microfrontends** em Angular 22:
um shell (host) orquestra três remotes carregados em runtime via **Native Federation**, sobre um
design system próprio, com estado compartilhado por signals e zero dependências de UI de terceiros.

![Mercado](./docs/market.png)

---

## Arquitetura

```text
crypto-tracker-mfe/
├── shell/                       # Host: layout, tema, roteamento, busca e moeda globais
├── remotes/
│   ├── market/                  # Ranking, busca, ordenação e paginação do mercado   (:4201)
│   ├── analytics/               # Detalhe do ativo, gráfico interativo e indicadores  (:4202)
│   └── watchlist/               # Ativos acompanhados pelo usuário                    (:4203)
├── libs/
│   ├── shared-ui/               # Design tokens + componentes/pipes de apresentação
│   ├── shared-state/            # Stores de estado compartilhado entre remotes (signals)
│   ├── shared-data-access/      # Models API/domínio, mappers puros e cliente HTTP
│   └── shared-utils/            # Formatadores puros e acesso a storage
├── scripts/                     # Geração de environments e do federation manifest
└── deploy/                      # Configurações de deploy (uma por microfrontend)
```

O shell resolve cada rota por federação e **degrada com elegância**: se um remote estiver fora do ar,
apenas aquela área exibe um estado de indisponibilidade — o resto da aplicação continua navegável.

```typescript
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'market' },
  { path: 'market', loadChildren: loadRemoteRoutes('market', 'Mercado') },
  { path: 'coins', loadChildren: loadRemoteRoutes('analytics', 'Análise') },
  { path: 'watchlist', loadChildren: loadRemoteRoutes('watchlist', 'Watchlist') },
];
```

### Fluxo de dados

```text
[Coinranking API] ←→ [CoinApiService] ←→ [Service de domínio] ←→ [Page] ←→ [Componentes puros]
        │                    │                     │
   payload cru          DTO tipado        camelCase + signals
        └──────── mapper (função pura) ────────────┘
```

- `CoinApiService` (em `shared-data-access`) só faz HTTP; recebe a config por injeção.
- Cada remote tem seu **service de domínio** com estado em signals (`MarketService`,
  `CoinAnalyticsService`, `WatchlistCoinsService`) — nenhum componente conhece o modelo da API.
- Os **mappers** convertem API ↔ domínio (strings → números, timestamps → `Date`, tendência).

### Isolamento e compartilhamento

| Assunto              | Decisão                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Config da API        | Provida nas rotas de cada remote (`provideCryptoApi`) — cada MFE carrega a própria credencial                                 |
| Estado de domínio    | Escopado às rotas do remote, destruído ao sair                                                                                |
| Estado compartilhado | `PreferencesStore` (moeda/tema), `WatchlistStore`, `MarketSearchStore`, `NotificationStore` — singletons via `sharedMappings` |
| Estilos              | Tokens CSS globais no shell; componentes usam apenas `var(--token)`                                                           |
| Dependências         | `shareAll` com `singleton: true` — uma única instância de Angular/RxJS em runtime                                             |

---

## Experiência e design

Direção **light editorial minimalista**: fundo de papel quente, tipografia serifada (Instrument
Serif) nos títulos, Inter com algarismos tabulares nos números e um único verde de acento.
Tema escuro completo pelo mesmo conjunto de tokens.

![Análise](./docs/analytics.png)

O que mudou em relação à versão anterior:

- **Estado na URL**: busca, ordenação, período, página e tamanho de página são compartilháveis.
- **Gráfico próprio em SVG** com crosshair, tooltip e navegação por teclado — sem Chart.js.
- **Atualização contínua**: revalidação a cada 120s (configurável por `DATA_REVALIDATE_INTERVAL_MS`),
  pausada enquanto a aba está oculta, com indicador "atualizado há…" e refresh manual.
- **Watchlist** persistida no navegador, sincronizada entre os três microfrontends.
- **Busca global** no header (atalho `/`), com debounce e sincronização com a rota do mercado.
- **Moeda e tema** globais e persistidos (BRL, USD, EUR, GBP).
- **Estados explícitos** de carregamento, vazio e erro, com toasts para falhas de rede.
- **Acessibilidade**: navegação por teclado, `aria-sort` nas colunas, skip link, foco visível,
  respeito a `prefers-reduced-motion`.
- **Sem bibliotecas de UI**: bundle inicial de ~38 kB comprimido (antes: PrimeNG + Chart.js).

![Watchlist](./docs/watchlist.png)

O mesmo conjunto de tokens serve o tema escuro:

![Mercado no tema escuro](./docs/market-dark.png)

---

## Rodando localmente

Pré-requisitos: Node 22+ e uma chave da [Coinranking](https://developers.coinranking.com/).

```bash
cp .env.example .env          # informe COINRANKING_API_KEY
npm install
npm start                     # shell :4200 · market :4201 · analytics :4202 · watchlist :4203
```

`npm start` gera os arquivos de environment e o `federation.manifest.json` antes de subir os quatro
servidores. Acesse **http://localhost:4200**.

Para trabalhar em um microfrontend isolado (ele sobe sozinho, com seu próprio bootstrap):

```bash
npm run start:market      # ou start:analytics / start:watchlist / start:shell
```

### Docker

```bash
docker compose up --build
```

---

## Scripts

| Script                      | O que faz                                                        |
| --------------------------- | ---------------------------------------------------------------- |
| `npm start`                 | Sobe shell + remotes em paralelo                                 |
| `npm run start:<app>`       | Sobe apenas um app (`shell`, `market`, `analytics`, `watchlist`) |
| `npm run build`             | Build de produção dos quatro apps em `dist/<app>/browser`        |
| `npm run build:<app>`       | Build de um único microfrontend                                  |
| `npm test`                  | Suíte completa (Vitest) — libs e apps                            |
| `npm run generate:env`      | Regenera os environments a partir do `.env`                      |
| `npm run generate:manifest` | Regenera o manifest de federação a partir das URLs dos remotes   |
| `npm run format`            | Prettier                                                         |

---

## Deploy

Cada microfrontend é **deployado de forma independente**. Na Vercel, crie um projeto por app usando
a configuração correspondente:

```bash
vercel deploy --prod --local-config=deploy/vercel.market.json
vercel deploy --prod --local-config=deploy/vercel.analytics.json
vercel deploy --prod --local-config=deploy/vercel.watchlist.json
vercel deploy --prod --local-config=deploy/vercel.shell.json
```

Antes de publicar o shell, aponte o manifest para as URLs públicas dos remotes:

```env
MFE_MARKET_URL=https://market.seu-dominio.com
MFE_ANALYTICS_URL=https://analytics.seu-dominio.com
MFE_WATCHLIST_URL=https://watchlist.seu-dominio.com
```

O `prebuild` regenera `shell/public/federation.manifest.json` com esses valores — trocar de ambiente
não exige rebuild dos remotes.

> A chave da Coinranking é embutida no bundle do cliente (como na versão original). Para uso público,
> coloque um proxy no backend e aponte `COINRANKING_BASE_URL` para ele.

---

## Troubleshooting

**Erros `404` de chunk ou `ngDevMode is not defined` no navegador durante o desenvolvimento.**
Acontece quando um build de produção (`npm run build`) roda com os dev servers no ar: os dois
compartilham o cache de artefatos da federação em `.angular/cache`. Pare os servidores e reinicie:

```bash
npm run clean && npm start
```

---

## Convenções de código

Seguem a skill `front-end` do repositório:

- Estrutura por remote/feature: `pages/`, `components/`, `services/`, `mappers/`, `models/`, `constants/`.
- Serviços em duas camadas: API (HTTP puro) e domínio (estado + regras).
- Estado com `signal`/`computed`; assinaturas encerradas com `takeUntilDestroyed`.
- `inject()` em vez de injeção por construtor; componentes `OnPush` e standalone.
- Código em inglês, sem comentários, autoexplicativo; textos de interface em português.
- Estilos apenas com design tokens — nada de cores ou espaçamentos hardcoded.

---

## Stack

Angular 22 (standalone, signals, zoneless) · Native Federation · TypeScript 6 · RxJS 7 · SCSS com
design tokens · Vitest · API pública da Coinranking.
