-- Schema inicial do banco de pendências.
-- Executado automaticamente pelo container do Postgres na primeira inicialização
-- (montado em /docker-entrypoint-initdb.d). A aplicação também garante a tabela
-- em tempo de execução (ver lib/db.js).

CREATE TABLE IF NOT EXISTS participantes (
  id          SERIAL PRIMARY KEY,
  nome        TEXT NOT NULL,
  photo_url   TEXT NOT NULL DEFAULT '',
  photo_path  TEXT NOT NULL DEFAULT '',
  pendencias  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_participantes_created_at
  ON participantes (created_at DESC);
