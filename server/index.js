require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
const NodeCache = require('node-cache');
const { Pool } = require('pg');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 3001;
const saltRounds = 10;
const cache = new NodeCache({ stdTTL: 7200 });

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const getOpenEntity = async (tableName) => {
    const result = await pool.query(`SELECT * FROM ${tableName} WHERE status = 'aberta' LIMIT 1`);
    return result.rows.length > 0 ? result.rows[0] : null;
};


// ROTAS DE AUTENTICAÇÃO

app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, cpf } = req.body;
  if (!nome || !email || !senha || !cpf) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  const cpfLimpo = cpf.replace(/[^\d]/g, '');

  try {
    const userCheck = await pool.query('SELECT 1 FROM contas WHERE email = $1 OR cpf = $2', [email, cpfLimpo]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Este email ou CPF já está em uso.' });
    }

    const senhaHash = await bcrypt.hash(senha, saltRounds);
    await pool.query(
      'INSERT INTO contas (nome, email, senha_hash, cpf) VALUES ($1, $2, $3, $4)',
      [nome, email, senhaHash, cpfLimpo]
    );
    res.status(201).json({ success: 'Conta criada com sucesso!' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

  try {
    const result = await pool.query('SELECT * FROM contas WHERE email = $1', [email]);
    const conta = result.rows[0];
    if (!conta) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const match = await bcrypt.compare(senha, conta.senha_hash);
    if (match) {
      res.status(200).json({ success: 'Login bem-sucedido!' });
    } else {
      res.status(401).json({ error: 'Senha incorreta.' });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// ROTAS DE GERENCIAMENTO DE COPAS

app.post('/api/copas', async (req, res) => {
    const { nome, data, local, limiteEquipes } = req.body;
    if (!nome || !data || !local || !limiteEquipes) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Inicia transação
        await client.query("UPDATE copas SET status = 'fechada'");
        const novaCopa = { id: Date.now(), nome, data, local, limiteEquipes, status: 'aberta' };
        await client.query(
            'INSERT INTO copas (id, nome, data, local, limite_equipes, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [novaCopa.id, novaCopa.nome, novaCopa.data, novaCopa.local, novaCopa.limiteEquipes, novaCopa.status]
        );
        await client.query('COMMIT'); // Finaliza transação
        res.status(201).json({ success: 'Copa criada e aberta para inscrições!', copa: novaCopa });
    } catch (error) {
        await client.query('ROLLBACK'); // Desfaz em caso de erro
        console.error('Erro ao criar copa:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    } finally {
        client.release();
    }
});

app.get('/api/copas/aberta', async (req, res) => {
    try {
        const copaAberta = await getOpenEntity('copas');
        res.json(copaAberta);
    } catch (error) {
        console.error('Erro ao buscar copa aberta:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.get('/api/copas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM copas ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar copas:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.get('/api/copas/:id/inscritos', async (req, res) => {
    const { id } = req.params;
    try {
        const equipesResult = await pool.query('SELECT * FROM equipes WHERE copa_id = $1', [id]);
        const avulsasResult = await pool.query('SELECT * FROM jogadoras_avulsas WHERE copa_id = $1', [id]);
        res.json({ equipes: equipesResult.rows, jogadorasAvulsas: avulsasResult.rows });
    } catch (error) {
        console.error('Erro ao buscar inscritos da copa:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// ROTAS DE GERENCIAMENTO DE ENCONTROS

app.post('/api/encontros', async (req, res) => {
  const { nome, data, local, limiteInscritos } = req.body;
  if (!nome || !data || !local || !limiteInscritos) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("UPDATE encontros SET status = 'fechada'");
    const novoEncontro = { id: Date.now(), nome, data, local, limiteInscritos: parseInt(limiteInscritos), status: 'aberta' };
    await client.query(
        'INSERT INTO encontros (id, nome, data, local, limite_inscritos, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [novoEncontro.id, novoEncontro.nome, novoEncontro.data, novoEncontro.local, novoEncontro.limiteInscritos, novoEncontro.status]
    );
    await client.query('COMMIT');
    res.status(201).json({ success: 'Encontro criado e aberto para inscrições!', encontro: novoEncontro });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar encontro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
});

app.get('/api/encontros/aberto', async (req, res) => {
  try {
    const encontroAberto = await getOpenEntity('encontros');
    res.json(encontroAberto);
  } catch (error) {
    console.error('Erro ao buscar encontro aberto:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/api/encontros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM encontros ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar encontros:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/api/encontros/:id/inscritos', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM inscricoes_encontro WHERE encontro_id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar inscritos do encontro:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// ROTAS DE INSCRIÇÃO

app.post('/inscricao-copa', async (req, res) => {
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.status(403).json({ error: 'Nenhuma copa aberta para inscrições no momento.' });

        const { nomeTime, responsavel, cpf, email, telefone, jogadoras } = req.body;
        const jogadorasLimpas = jogadoras.map(j => ({ nome: j.nome, cpf: j.cpf.replace(/[^\d]/g, '') }));
        
        await pool.query(
            'INSERT INTO equipes (id, copa_id, nome_time, responsavel, cpf, email, telefone, jogadoras) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [Date.now(), copaAberta.id, nomeTime, responsavel, cpf.replace(/[^\d]/g, ''), email, telefone, JSON.stringify(jogadorasLimpas)]
        );
        res.status(201).json({ success: 'Inscrição realizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao inscrever equipe:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.post('/inscricao-jogadora', async (req, res) => {
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.status(403).json({ error: 'Nenhuma copa aberta para inscrições no momento.' });

        const { nome, cpf, email, telefone } = req.body;
        
        await pool.query(
            'INSERT INTO jogadoras_avulsas (id, copa_id, nome, cpf, email, telefone) VALUES ($1, $2, $3, $4, $5, $6)',
            [Date.now(), copaAberta.id, nome, cpf.replace(/[^\d]/g, ''), email, telefone]
        );
        res.status(201).json({ success: 'Inscrição realizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao inscrever jogadora avulsa:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.post('/inscricao-encontro', async (req, res) => {
  try {
    const encontroAberto = await getOpenEntity('encontros');
    if (!encontroAberto) return res.status(403).json({ error: 'Nenhum encontro aberto para inscrições.' });

    const { nome, cpf, email, telefone } = req.body;
    if (!nome || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios.' });

    const countResult = await pool.query('SELECT count(*) FROM inscricoes_encontro WHERE encontro_id = $1', [encontroAberto.id]);
    if (parseInt(countResult.rows[0].count) >= encontroAberto.limite_inscritos) {
      return res.status(403).json({ error: 'Inscrições esgotadas para este encontro.' });
    }
    
    const userCheck = await pool.query('SELECT 1 FROM inscricoes_encontro WHERE email = $1 AND encontro_id = $2', [email, encontroAberto.id]);
    if(userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Você já está inscrito neste encontro.' });
    }

    await pool.query(
        'INSERT INTO inscricoes_encontro (id, encontro_id, nome, cpf, email, telefone) VALUES ($1, $2, $3, $4, $5, $6)',
        [Date.now(), encontroAberto.id, nome, cpf, email, telefone]
    );
    res.status(201).json({ success: 'Inscrição no encontro realizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao inscrever em encontro:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.get('/api/encontros/aberto/inscricoes', async (req, res) => {
    try {
        const encontroAberto = await getOpenEntity('encontros');
        if (!encontroAberto) return res.json([]);

        const result = await pool.query('SELECT * FROM inscricoes_encontro WHERE encontro_id = $1', [encontroAberto.id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar inscritos do encontro aberto:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// ROTAS DE ADMIN

app.get('/api/equipes', async (req, res) => {
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.json([]);
        
        const result = await pool.query('SELECT * FROM equipes WHERE copa_id = $1', [copaAberta.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar equipes.' });
    }
});

app.get('/api/jogadoras-avulsas', async (req, res) => {
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.json([]);

        const result = await pool.query('SELECT * FROM jogadoras_avulsas WHERE copa_id = $1', [copaAberta.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar jogadoras avulsas.' });
    }
});

app.post('/api/equipes/:timeId/adicionar-jogadora', async (req, res) => {
  const { timeId } = req.params;
  const jogadoraParaAdicionar = req.body;

  if (!jogadoraParaAdicionar || !jogadoraParaAdicionar.id) {
    return res.status(400).json({ error: 'Dados da jogadora são inválidos.' });
  }

  const client = await pool.connect();
  try {
    const copaAberta = await getOpenEntity('copas');
    if (!copaAberta) throw new Error('Nenhuma copa aberta para gerenciar.');
    
    await client.query('BEGIN');

    const novaJogadoraJson = JSON.stringify({ nome: jogadoraParaAdicionar.nome, cpf: jogadoraParaAdicionar.cpf.replace(/[^\d]/g, '') });
    const updateResult = await client.query(
      `UPDATE equipes 
       SET jogadoras = jogadoras || $1::jsonb 
       WHERE id = $2 AND copa_id = $3`,
      [novaJogadoraJson, timeId, copaAberta.id]
    );

    if (updateResult.rowCount === 0) throw new Error('Equipe não encontrada.');

    const deleteResult = await client.query(
      'DELETE FROM jogadoras_avulsas WHERE id = $1 AND copa_id = $2',
      [jogadoraParaAdicionar.id, copaAberta.id]
    );
    
    if (deleteResult.rowCount === 0) throw new Error('Jogadora avulsa não encontrada.');

    await client.query('COMMIT');
    res.json({ success: 'Jogadora adicionada com sucesso!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Erro ao adicionar jogadora à equipe:", error);
    res.status(500).json({ error: error.message || 'Erro ao processar a solicitação.' });
  } finally {
    client.release();
  }
});


// ROTAS DE GERENCIAMENTO DE NOTÍCIAS

app.get('/api/noticias', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM noticias ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        res.status(500).json({ error: 'Erro ao ler o banco de dados de notícias.' });
    }
});

app.get('/api/noticias/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM noticias WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Notícia não encontrada.' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar notícia:', error);
        res.status(500).json({ error: 'Erro ao ler o banco de dados.' });
    }
});

app.post('/api/noticias', async (req, res) => {
    try {
        const { titulo, resumo, conteudo, imagens, destaque } = req.body;
        if (!titulo || !conteudo || !resumo) return res.status(400).json({ error: 'Título, resumo e conteúdo são obrigatórios.' });
        
        const result = await pool.query(
            'INSERT INTO noticias (id, titulo, resumo, conteudo, imagens, destaque) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [Date.now(), titulo, resumo, conteudo, imagens || [], destaque || false]
        );
        res.status(201).json({ success: 'Notícia adicionada com sucesso!', noticia: result.rows[0] });
    } catch (error) {
        console.error("Erro em POST /api/noticias:", error);
        res.status(500).json({ error: 'Erro ao salvar a nova notícia.' });
    }
});

app.put('/api/noticias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, resumo, conteudo, imagens, destaque } = req.body;
    const result = await pool.query(
        'UPDATE noticias SET titulo = $1, resumo = $2, conteudo = $3, imagens = $4, destaque = $5 WHERE id = $6 RETURNING *',
        [titulo, resumo, conteudo, imagens, destaque, id]
    );
    if(result.rowCount === 0) return res.status(404).json({error: 'Notícia não encontrada para atualizar.'});
    res.json({ success: 'Notícia atualizada com sucesso!', noticia: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    res.status(500).json({ error: 'Erro ao salvar a notícia.' });
  }
});

app.patch('/api/noticias/:id/toggle-destaque', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('UPDATE noticias SET destaque = NOT destaque WHERE id = $1 RETURNING *', [id]);
    if(result.rowCount === 0) return res.status(404).json({error: 'Notícia não encontrada.'});
    res.json({ success: 'Status de destaque alterado!', noticia: result.rows[0] });
  } catch (error) {
    console.error('Erro ao alterar destaque da notícia:', error);
    res.status(500).json({ error: 'Erro ao salvar a alteração.' });
  }
});


// ROTAS DE USUÁRIO

app.get('/api/usuario/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const result = await pool.query('SELECT id, nome, email, cpf, time_favorito_id FROM contas WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.post('/api/usuario/favoritar-time', async (req, res) => {
    const { email, timeId } = req.body;
    const timeIdNumerico = timeId ? parseInt(timeId, 10) : null;
    if (!email || timeIdNumerico === null) return res.status(400).json({ error: 'Email e timeId são obrigatórios.'});

    try {
        const result = await pool.query(
            'UPDATE contas SET time_favorito_id = $1 WHERE email = $2 RETURNING id, nome, email, cpf, time_favorito_id',
            [timeIdNumerico, email]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json({ success: 'Time favorito salvo com sucesso!', user: result.rows[0] });
    } catch (error) {
        console.error('Erro ao favoritar time:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.get('/api/usuario/minhas-inscricoes/:email', async (req, res) => {
    const { email } = req.params;
    let response = { copa: null, encontro: null, copaAvulsa: null };
    try {
        const userResult = await pool.query('SELECT cpf FROM contas WHERE email = $1', [email]);
        const userCpf = userResult.rows.length > 0 ? userResult.rows[0].cpf : null;

        const copaAberta = await getOpenEntity('copas');
        if (copaAberta) {
            if (userCpf) {
                const equipeResult = await pool.query(
                    `SELECT *, (CASE WHEN email = $1 THEN 'responsavel' ELSE 'jogadora' END) as role 
                     FROM equipes 
                     WHERE copa_id = $2 AND (email = $1 OR jogadoras @> $3::jsonb)`,
                    [email, copaAberta.id, JSON.stringify([{cpf: userCpf}])]
                );
                if (equipeResult.rows.length > 0) response.copa = equipeResult.rows[0];
            }
            const avulsaResult = await pool.query('SELECT * FROM jogadoras_avulsas WHERE email = $1 AND copa_id = $2', [email, copaAberta.id]);
            if (avulsaResult.rows.length > 0) response.copaAvulsa = { ...avulsaResult.rows[0], nomeCopa: copaAberta.nome };
        }

        const encontroAberto = await getOpenEntity('encontros');
        if (encontroAberto) {
            const encontroResult = await pool.query('SELECT * FROM inscricoes_encontro WHERE email = $1 AND encontro_id = $2', [email, encontroAberto.id]);
            if (encontroResult.rows.length > 0) response.encontro = { ...encontroResult.rows[0], nomeEncontro: encontroAberto.nome };
        }
        res.json(response);
    } catch (error) {
        console.error('Erro ao buscar minhas inscrições:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// ROTAS DE CANCELAMENTO

app.delete('/api/inscricao-copa/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.status(404).json({ error: 'Nenhuma copa aberta encontrada.' });
        await pool.query('DELETE FROM equipes WHERE email = $1 AND copa_id = $2', [email, copaAberta.id]);
        res.json({ success: 'Inscrição da equipe cancelada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar inscrição de equipe:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.delete('/api/inscricao-encontro/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const encontroAberto = await getOpenEntity('encontros');
        if (!encontroAberto) return res.status(404).json({ error: 'Nenhum encontro aberto encontrado.' });
        await pool.query('DELETE FROM inscricoes_encontro WHERE email = $1 AND encontro_id = $2', [email, encontroAberto.id]);
        res.json({ success: 'Inscrição no encontro cancelada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar inscrição de encontro:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.delete('/api/equipes/:timeId/jogadora/:cpf', async (req, res) => {
    const { timeId, cpf } = req.params;
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.status(404).json({ error: 'Nenhuma copa aberta.' });
        
        const result = await pool.query(
            `UPDATE equipes SET jogadoras = (
                SELECT jsonb_agg(elem) FROM jsonb_array_elements(jogadoras) AS elem WHERE elem->>'cpf' != $1
            ) WHERE id = $2 AND copa_id = $3`,
            [cpf.replace(/[^\d]/g, ''), timeId, copaAberta.id]
        );

        if (result.rowCount === 0) return res.status(404).json({ error: 'Jogadora ou time não encontrado.' });
        res.json({ success: 'Sua participação foi cancelada com sucesso.' });
    } catch (error) {
        console.error('Erro ao remover jogadora do time:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.delete('/api/inscricao-jogadora/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const copaAberta = await getOpenEntity('copas');
        if (!copaAberta) return res.status(404).json({ error: 'Nenhuma copa aberta encontrada.' });
        await pool.query('DELETE FROM jogadoras_avulsas WHERE email = $1 AND copa_id = $2', [email, copaAberta.id]);
        res.json({ success: 'Inscrição avulsa na copa cancelada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar inscrição avulsa:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// ROTAS DE EXPORTAÇÃO (EXCEL/PDF)

app.get('/api/encontros/:id/inscritos/excel', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT nome, cpf, email, telefone FROM inscricoes_encontro WHERE encontro_id = $1', [id]);
    const inscritos = result.rows;
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Inscritos");
    sheet.columns = [ { header: "Nome", key: "nome", width: 30 }, { header: "CPF", key: "cpf", width: 20 }, { header: "Email", key: "email", width: 30 }, { header: "Telefone", key: "telefone", width: 20 } ];
    sheet.addRows(inscritos);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=inscritos-encontro-${id}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) { res.status(500).send('Erro ao gerar arquivo Excel.'); }
});

app.get('/api/encontros/:id/inscritos/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM inscricoes_encontro WHERE encontro_id = $1', [id]);
    const inscritos = result.rows;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=inscritos-encontro-${id}.pdf`);
    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(18).text(`Inscritos do Encontro ${id}`, { align: "center" }).moveDown();
    inscritos.forEach((inscrito, index) => {
      doc.fontSize(12).text(`${index + 1}. Nome: ${inscrito.nome} | CPF: ${inscrito.cpf} | Email: ${inscrito.email}`);
      doc.moveDown(0.5);
    });
    doc.end();
  } catch (error) { res.status(500).send('Erro ao gerar arquivo PDF.'); }
});

app.get('/api/copas/:id/inscritos/excel', async (req, res) => {
    try {
        const { id } = req.params;
        const equipesResult = await pool.query('SELECT * FROM equipes WHERE copa_id = $1', [id]);
        const avulsasResult = await pool.query('SELECT * FROM jogadoras_avulsas WHERE copa_id = $1', [id]);
        
        const workbook = new ExcelJS.Workbook();
        const sheetEquipes = workbook.addWorksheet("Equipes");
        sheetEquipes.columns = [ { header: "Time", key: "nomeTime", width: 25 }, { header: "Responsável", key: "responsavel", width: 25 }, { header: "Email", key: "email", width: 30 }, { header: "Jogadoras", key: "jogadoras", width: 50 } ];
        equipesResult.rows.forEach(equipe => {
            sheetEquipes.addRow({ ...equipe, nomeTime: equipe.nome_time, jogadoras: equipe.jogadoras.map(j => `${j.nome} (${j.cpf})`).join(", ") });
        });

        const sheetAvulsas = workbook.addWorksheet("Jogadoras Avulsas");
        sheetAvulsas.columns = [ { header: "Nome", key: "nome", width: 30 }, { header: "CPF", key: "cpf", width: 20 }, { header: "Email", key: "email", width: 30 } ];
        sheetAvulsas.addRows(avulsasResult.rows);

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=inscritos-copa-${id}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) { res.status(500).send('Erro ao gerar arquivo Excel.'); }
});

app.get('/api/copas/:id/inscritos/pdf', async (req, res) => {
    try {
        const { id } = req.params;
        const equipesResult = await pool.query('SELECT * FROM equipes WHERE copa_id = $1', [id]);
        const avulsasResult = await pool.query('SELECT * FROM jogadoras_avulsas WHERE copa_id = $1', [id]);
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=inscritos-copa-${id}.pdf`);
        const doc = new PDFDocument();
        doc.pipe(res);
        doc.fontSize(18).text(`Inscritos da Copa ${id}`, { align: "center" }).moveDown(2);
        
        doc.fontSize(14).text("Equipes:").moveDown();
        equipesResult.rows.forEach((equipe, i) => {
            doc.fontSize(12).text(`${i + 1}. ${equipe.nome_time} (Responsável: ${equipe.responsavel})`);
            doc.fontSize(10);
            equipe.jogadoras.forEach(j => doc.text(`   - ${j.nome} (${j.cpf})`));
            doc.moveDown();
        });

        doc.addPage().fontSize(18).text(`Inscritos da Copa ${id} (Avulsas)`, { align: "center" }).moveDown(2);
        doc.fontSize(14).text("Jogadoras Avulsas:").moveDown();
        avulsasResult.rows.forEach((j, i) => {
            doc.fontSize(12).text(`${i + 1}. ${j.nome} | CPF: ${j.cpf} | Email: ${j.email}`);
        });
        
        doc.end();
    } catch (error) { res.status(500).send('Erro ao gerar arquivo PDF.'); }
});


// ROTAS DA API-FOOTBALL
const apiConfig = { headers: { 'x-apisports-key': process.env.API_KEY } };

app.get('/api/ligas', async (req, res) => {
  const cacheKey = 'ligas';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);
  try {
    const response = await axios.get('https://v3.football.api-sports.io/leagues', { params: { country: 'Brazil' }, headers: apiConfig.headers });
    cache.set(cacheKey, response.data.response);
    res.json(response.data.response);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar ligas.' }); }
});

app.get('/api/tabela', async (req, res) => {
  const cacheKey = 'tabela';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return res.json(cachedData);
  try {
    const response = await axios.get('https://v3.football.api-sports.io/standings', { params: { league: '74', season: '2023' }, headers: apiConfig.headers });
    if (!response.data.response || response.data.response.length === 0) return res.json([]);
    const tabelaFormatada = response.data.response[0].league.standings[0].map(item => ({ pos: item.rank, time: { nome: item.team.name, logo: item.team.logo }, P: item.points, J: item.all.played, V: item.all.win, E: item.all.draw, D: item.all.lose, GP: item.all.goals.for, GC: item.all.goals.against, SG: item.goalsDiff }));
    cache.set(cacheKey, tabelaFormatada);
    res.json(tabelaFormatada);
  } catch (error) { res.status(500).json({ error: 'Erro ao buscar dados da tabela.' }); }
});
  
app.get('/api/partidas', async (req, res) => {
    const cacheKey = 'partidas';
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);
    try {
      const response = await axios.get('https://v3.football.api-sports.io/fixtures', { params: { league: '74', season: '2023' }, headers: apiConfig.headers });
      if (!response.data.response || response.data.response.length === 0) return res.json([]);
      const partidasFormatadas = response.data.response.map(partida => ({ id: partida.fixture.id, campeonato: partida.league.name, timeCasa: { nome: partida.teams.home.name, logo: partida.teams.home.logo }, timeFora: { nome: partida.teams.away.name, logo: partida.teams.away.logo }, data: new Date(partida.fixture.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), hora: new Date(partida.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), status: partida.fixture.status.short }));
      cache.set(cacheKey, partidasFormatadas);
      res.json(partidasFormatadas);
    } catch (error) { res.status(500).json({ error: 'Erro ao buscar dados das partidas.' }); }
});
    
app.get('/api/artilharia', async (req, res) => {
    const cacheKey = 'artilharia';
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);
    try {
      const response = await axios.get('https://v3.football.api-sports.io/players/topscorers', { params: { league: '74', season: '2023' }, headers: apiConfig.headers });
      if (!response.data.response || response.data.response.length === 0) return res.json([]);
      const artilhariaFormatada = response.data.response.map(jogador => ({ id: jogador.player.id, jogadora: jogador.player.name, time: jogador.statistics[0].team.name, logo: jogador.statistics[0].team.logo, gols: jogador.statistics[0].goals.total }));
      cache.set(cacheKey, artilhariaFormatada);
      res.json(artilhariaFormatada);
    } catch (error) { res.status(500).json({ error: 'Erro ao buscar dados da artilharia.' }); }
});

app.get('/api/ligas/:leagueId/times', async (req, res) => {
    const { leagueId } = req.params;
    const cacheKey = `ligas-${leagueId}-times`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);
    const options = { method: 'GET', url: 'https://v3.football.api-sports.io/teams', params: { league: leagueId, season: '2023' }, headers: apiConfig.headers };
    try {
      const response = await axios.request(options);
      cache.set(cacheKey, response.data.response);
      res.json(response.data.response);
    } catch (error) { res.status(500).json({ error: 'Erro ao buscar times da liga.' }); }
});
  
app.get('/api/times/:timeId/partidas', async (req, res) => {
    const { timeId } = req.params;
    const cacheKey = `time-${timeId}-partidas`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);
    const options = { method: 'GET', url: 'https://v3.football.api-sports.io/fixtures', params: { team: timeId, season: '2023' }, headers: apiConfig.headers };
    try {
      const response = await axios.request(options);
      const partidasFormatadas = response.data.response.map(partida => ({ id: partida.fixture.id, campeonato: partida.league.name, timeCasa: { nome: partida.teams.home.name, logo: partida.teams.home.logo }, timeFora: { nome: partida.teams.away.name, logo: partida.teams.away.logo }, data: new Date(partida.fixture.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), hora: new Date(partida.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), }));
      cache.set(cacheKey, partidasFormatadas);
      res.json(partidasFormatadas);
    } catch (error) { res.status(500).json({ error: 'Erro ao buscar partidas do time.' }); }
});


// INICIA O SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});