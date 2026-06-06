import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH ?? './data/easygest.db';

// Garante que a pasta existe
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Singleton — reutilizada em toda a aplicação
export const db = new Database(DB_PATH, {
  // verbose: console.log,   // descomente para logar todas as queries
});

// Habilita WAL mode (melhor performance para leitura/escrita simultânea)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
