// Pool de conexões com o PostgreSQL.
// Reutiliza a mesma instância durante o hot-reload do Next.js.
import { Pool } from "pg";

const globalForPg = globalThis;

export const pool =
  globalForPg._pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      "postgres://postgres:postgres@localhost:5432/pendencias",
  });

if (!globalForPg._pgPool) globalForPg._pgPool = pool;

// Garante que a tabela exista (idempotente). Útil tanto no Docker quanto
// rodando localmente sem precisar aplicar o init.sql manualmente.
let schemaReady;
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS participantes (
        id          SERIAL PRIMARY KEY,
        nome        TEXT NOT NULL,
        photo_url   TEXT NOT NULL DEFAULT '',
        photo_path  TEXT NOT NULL DEFAULT '',
        pendencias  INTEGER NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }
  return schemaReady;
}

export async function query(text, params) {
  await ensureSchema();
  return pool.query(text, params);
}

// Converte a linha do banco (snake_case) para o formato usado no front.
export function mapParticipant(row) {
  return {
    id: row.id,
    nome: row.nome,
    photoURL: row.photo_url,
    photoPath: row.photo_path,
    pendencias: row.pendencias,
    createdAt: row.created_at,
  };
}
