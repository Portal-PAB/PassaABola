// init-db.js
require('dotenv').config();
const { Pool } = require('pg');

// Configura a conexão usando a variável de ambiente DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Adicione a configuração SSL para conexões com o Render
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

  // Tabela para as Copas
  `CREATE TABLE IF NOT EXISTS copas (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    data VARCHAR(100),
    local VARCHAR(255),
    limite_equipes INTEGER,
    status VARCHAR(20) DEFAULT 'fechada'
  );`,

  // Tabela para os Encontros
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
    jogadoras JSONB, -- Coluna JSONB para armazenar a lista de jogadoras
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
    imagens TEXT[], -- Array de strings para as URLs das imagens
    destaque BOOLEAN DEFAULT false
  );`
];

// Função que executa as queries para criar as tabelas
async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Iniciando a criação das tabelas no banco de dados...');
    for (const query of queries) {
      await client.query(query);
    }
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Ocorreu um erro ao criar as tabelas:', error);
  } finally {
    client.release();
    await pool.end();
    console.log('Conexão com o banco de dados encerrada.');
  }
}

setupDatabase();