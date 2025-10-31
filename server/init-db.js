// init-db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const queries = [
  // Tabela para armazenar as contas dos usuários
  `CREATE TABLE IF NOT EXISTS contas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    time_favorito_id INTEGER
  );`,

  // Tabela para as Copas (Eventos PAB)
  `CREATE TABLE IF NOT EXISTS copas (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data VARCHAR(100),
    local VARCHAR(255),
    limite_equipes INTEGER,
    status VARCHAR(20) DEFAULT 'fechada'
  );`,

  // Tabela para os Encontros (Eventos PAB)
  `CREATE TABLE IF NOT EXISTS encontros (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data VARCHAR(100),
    local VARCHAR(255),
    limite_inscritos INTEGER,
    status VARCHAR(20) DEFAULT 'fechada'
  );`,

  // Tabela para as equipes inscritas nas copas
  `CREATE TABLE IF NOT EXISTS equipes (
    id BIGINT PRIMARY KEY,
    copa_id BIGINT REFERENCES copas(id) ON DELETE CASCADE,
    nome_time VARCHAR(255) NOT NULL,
    responsavel VARCHAR(100),
    cpf VARCHAR(14),
    email VARCHAR(100),
    telefone VARCHAR(20),
    jogadoras JSONB,
    data_inscricao TIMESTAMPTZ DEFAULT NOW()
  );`,

  // Tabela para jogadoras avulsas inscritas nas copas
  `CREATE TABLE IF NOT EXISTS jogadoras_avulsas (
    id BIGINT PRIMARY KEY,
    copa_id BIGINT REFERENCES copas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14),
    email VARCHAR(100),
    telefone VARCHAR(20),
    data_inscricao TIMESTAMPTZ DEFAULT NOW()
  );`,

  // Tabela para inscrições nos encontros
  `CREATE TABLE IF NOT EXISTS inscricoes_encontro (
    id BIGINT PRIMARY KEY,
    encontro_id BIGINT REFERENCES encontros(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14),
    email VARCHAR(100),
    telefone VARCHAR(20),
    data_inscricao TIMESTAMPTZ DEFAULT NOW()
  );`,

  // Tabela para as notícias
  `CREATE TABLE IF NOT EXISTS noticias (
    id BIGINT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumo TEXT,
    conteudo TEXT NOT NULL,
    imagens TEXT[],
    destaque BOOLEAN DEFAULT false
  );`,

  // --- NOVAS TABELAS PARA SUBSTITUIR A API DE FUTEBOL ---

  `CREATE TABLE IF NOT EXISTS campeonatos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    ano INTEGER,
    ativo BOOLEAN DEFAULT false
  );`,

  `CREATE TABLE IF NOT EXISTS times (
    id INTEGER PRIMARY KEY, -- Importante: Este será o ID da API antiga (ex: 74)
    nome VARCHAR(255) NOT NULL,
    logo_url TEXT
  );`,

  `CREATE TABLE IF NOT EXISTS partidas (
    id SERIAL PRIMARY KEY,
    campeonato_id INTEGER REFERENCES campeonatos(id),
    time_casa_id INTEGER REFERENCES times(id),
    time_fora_id INTEGER REFERENCES times(id),
    data TIMESTAMPTZ,
    status VARCHAR(50),
    gols_casa INTEGER DEFAULT 0,
    gols_fora INTEGER DEFAULT 0
  );`,

  `CREATE TABLE IF NOT EXISTS tabela (
    id SERIAL PRIMARY KEY,
    campeonato_id INTEGER REFERENCES campeonatos(id),
    time_id INTEGER REFERENCES times(id) ON DELETE CASCADE,
    pontos INTEGER DEFAULT 0,
    jogos INTEGER DEFAULT 0,
    vitorias INTEGER DEFAULT 0,
    empates INTEGER DEFAULT 0,
    derrotas INTEGER DEFAULT 0,
    gols_pro INTEGER DEFAULT 0,
    gols_contra INTEGER DEFAULT 0,
    saldo_gols INTEGER DEFAULT 0,
    UNIQUE(campeonato_id, time_id)
  );`,
  
  `CREATE TABLE IF NOT EXISTS artilharia (
    id SERIAL PRIMARY KEY,
    campeonato_id INTEGER REFERENCES campeonatos(id),
    time_id INTEGER REFERENCES times(id),
    nome_jogadora VARCHAR(255) NOT NULL,
    gols INTEGER DEFAULT 0
  );`
];

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Iniciando a criação/atualização das tabelas no banco de dados...');
    for (const query of queries) {
      await client.query(query);
    }
    console.log('Tabelas criadas/atualizadas com sucesso!');
  } catch (error) {
    console.error('Ocorreu um erro ao criar as tabelas:', error);
  } finally {
    client.release();
    await pool.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

setupDatabase();