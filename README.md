# Dashboard de Pendências

SPA construída com **Next.js (App Router)**, **Firebase Firestore**, **Firebase Storage** e **Tailwind CSS** para controlar as pendências de participantes em tempo real.

## Funcionalidades

- **Upload de imagem**: ao cadastrar um participante, a foto é enviada para o Firebase Storage e a URL gerada é salva no documento do Firestore.
- **Lista em tempo real**: usa `onSnapshot` — a lista atualiza instantaneamente, sem recarregar a página.
- **Status por cor** conforme o número de pendências:
  - 🟢 **Verde** — 0 a 3 (Baixo)
  - 🟡 **Amarelo** — 4 a 7 (Médio)
  - 🔴 **Vermelho** — 8 ou mais (Crítico)
- **Botões `+` / `−`** em cada card para ajustar as pendências manualmente.
- **Avatar circular**, layout limpo, moderno e **responsivo**.

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um projeto no [Firebase](https://console.firebase.google.com/), habilite **Firestore Database** e **Storage**, e copie as credenciais do app web.

3. Copie o arquivo de exemplo e preencha com suas credenciais:

   ```bash
   cp .env.local.example .env.local
   ```

4. Rode em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura

```
app/
  layout.js          # Layout raiz + metadata
  page.js            # Página principal (SPA) com lógica do Firestore/Storage
  globals.css        # Tailwind
components/
  ParticipantForm.js # Formulário: Nome + Foto + Adicionar
  ParticipantCard.js # Card com avatar, status e botões +/-
lib/
  firebase.js        # Inicialização do Firebase
  status.js          # Regras de cor por nível de pendências
```

## Regras de segurança (sugestão para desenvolvimento)

No Firestore e no Storage, durante o desenvolvimento você pode liberar o acesso.
**Em produção, configure regras de autenticação adequadas.**
