# Dashboard de Pendências

SPA construída com **Next.js (App Router)**, **PostgreSQL**, **Docker** e **Tailwind CSS** para controlar as pendências de participantes.

## Funcionalidades

- **Upload de imagem**: ao cadastrar um participante, a foto é enviada via API e salva em um volume de uploads; a URL fica registrada no PostgreSQL.
- **Lista atualizada em tempo real**: o front faz *polling* a cada 3s (`/api/participants`), refletindo mudanças sem recarregar a página.
- **Status por cor** conforme o número de pendências:
  - 🟢 **Verde** — 0 a 3 (Baixo)
  - 🟡 **Amarelo** — 4 a 7 (Médio)
  - 🔴 **Vermelho** — 8 ou mais (Crítico)
- **Botões `+` / `−`** em cada card para ajustar as pendências (com atualização otimista).
- **Avatar circular**, layout limpo, moderno e **responsivo**.

## Arquitetura

```
app/
  api/
    participants/route.js          # GET (listar) e POST (criar + upload)
    participants/[id]/route.js     # PATCH (ajustar pendências) e DELETE
    uploads/[filename]/route.js    # serve as imagens do volume de uploads
  page.js                          # SPA (fetch + polling)
  layout.js, globals.css
components/
  ParticipantForm.js               # Nome + Foto + Adicionar
  ParticipantCard.js               # avatar, status e botões +/-
lib/
  db.js                            # pool do PostgreSQL + schema idempotente
  uploads.js                       # gravação/leitura das fotos
db/
  init.sql                         # schema inicial (Postgres no Docker)
Dockerfile, docker-compose.yml
```

## Como rodar com Docker (recomendado)

Sobe o app + PostgreSQL com um comando:

```bash
docker compose up --build
```

Acesse [http://localhost:3000](http://localhost:3000). O banco e as fotos ficam em volumes persistentes (`pgdata` e `uploads`).

## Como rodar localmente (sem Docker)

1. Tenha um PostgreSQL acessível e crie o banco `pendencias`.
2. Configure o ambiente:

   ```bash
   cp .env.example .env
   # ajuste DATABASE_URL se necessário
   ```

3. Instale e rode:

   ```bash
   npm install
   npm run dev
   ```

   A tabela é criada automaticamente na primeira consulta (`lib/db.js`).

## Variáveis de ambiente

| Variável        | Descrição                                   | Padrão                                                  |
| --------------- | ------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`  | String de conexão com o PostgreSQL          | `postgres://postgres:postgres@localhost:5432/pendencias` |
| `UPLOADS_DIR`   | Diretório onde as fotos são gravadas        | `./uploads`                                            |
