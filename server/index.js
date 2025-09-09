require('dotenv').config();
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');
const app = express();

const PORT = 3001;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  const dbPath = './contas.json';

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erro ao ler o banco de dados.' });
    }

    const contas = data ? JSON.parse(data) : [];

    if (contas.find(conta => conta.email === email)) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }

    bcrypt.hash(senha, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao proteger a senha.' });
      }

      contas.push({ nome, email, senhaHash: hash });

      fs.writeFile(dbPath, JSON.stringify(contas, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar a conta.' });
        }
        res.status(201).json({ success: 'Conta criada com sucesso!' });
      });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const dbPath = './contas.json';

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const contas = JSON.parse(data);
    const conta = contas.find(c => c.email === email);
    if (!conta) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    bcrypt.compare(senha, conta.senhaHash, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor.' });
      }
      if (result) {
        res.status(200).json({ success: 'Login bem-sucedido!' });
      } else {
        res.status(401).json({ error: 'Senha incorreta.' });
      }
    });
  });
});

app.post('/inscricao-copa', (req, res) => {
  const { nomeTime, responsavel, cpf, email, telefone, jogadoras } = req.body;
  const dbEquipesPath = './equipes.json';

  if (!nomeTime || !responsavel || !cpf || !email || !jogadoras || jogadoras.length === 0) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  const novaEquipe = {
    id: Date.now(),
    nomeTime,
    responsavel,
    cpf,
    email,
    telefone,
    jogadoras,
    data_inscricao: new Date().toISOString(),
  };

  fs.readFile(dbEquipesPath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erro ao ler o banco de dados de equipes.' });
    }
    const equipes = data ? JSON.parse(data) : [];
    equipes.push(novaEquipe);

    fs.writeFile(dbEquipesPath, JSON.stringify(equipes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar a inscrição.' });
      }
      res.status(201).json({ success: 'Inscrição realizada com sucesso!' });
    });
  });
});

app.post('/inscricao-jogadora', (req, res) => {
  const { nome, cpf, email, telefone } = req.body;
  const dbJogadorasPath = './jogadoras-avulsas.json';

  if (!nome || !cpf || !email) {
    return res.status(400).json({ error: 'Nome, CPF e email são obrigatórios.' });
  }

  const novaJogadora = {
    id: Date.now(),
    nome,
    cpf,
    email,
    telefone,
    data_inscricao: new Date().toISOString(),
  };

  fs.readFile(dbJogadorasPath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erro ao ler o banco de dados.' });
    }
    const jogadoras = data ? JSON.parse(data) : [];
    jogadoras.push(novaJogadora);

    fs.writeFile(dbJogadorasPath, JSON.stringify(jogadoras, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar a inscrição.' });
      }
      res.status(201).json({ success: 'Inscrição realizada com sucesso!' });
    });
  });
});

const apiConfig = {
  headers: {
    'x-apisports-key': process.env.API_KEY
  }
};


app.get('/api/ligas', async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/leagues', {
      params: { country: 'Brazil' },
      headers: apiConfig.headers
    });
    res.json(response.data.response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar ligas.' });
  }
});


app.get('/api/tabela', async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/standings', {
      params: { league: '74', season: '2023' }, 
      headers: apiConfig.headers
    });

    if (!response.data.response || response.data.response.length === 0) {
      console.log('API de Tabela retornou uma resposta vazia.');
      return res.json([]);
    }

    const tabelaFormatada = response.data.response[0].league.standings[0].map(item => ({
      pos: item.rank,
      time: { nome: item.team.name, logo: item.team.logo },
      P: item.points,
      J: item.all.played,
      V: item.all.win,
      E: item.all.draw,
      D: item.all.lose,
      GP: item.all.goals.for,
      GC: item.all.goals.against,
      SG: item.goalsDiff
    }));

    res.json(tabelaFormatada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados da tabela.' });
  }
});


app.get('/api/partidas', async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
      params: { league: '74', season: '2023' },
      headers: apiConfig.headers
    });

    if (!response.data.response || response.data.response.length === 0) {
      console.log('API de Partidas retornou uma resposta vazia.');
      return res.json([]);
    }

    const partidasFormatadas = response.data.response.map(partida => ({
      id: partida.fixture.id,
      campeonato: partida.league.name,
      timeCasa: { nome: partida.teams.home.name, logo: partida.teams.home.logo },
      timeFora: { nome: partida.teams.away.name, logo: partida.teams.away.logo },
      data: new Date(partida.fixture.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      hora: new Date(partida.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: partida.fixture.status.short
    }));

    res.json(partidasFormatadas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados das partidas.' });
  }
});


app.get('/api/artilharia', async (req, res) => {
  try {
    const response = await axios.get('https://v3.football.api-sports.io/players/topscorers', {
      params: { league: '74', season: '2023' },
      headers: apiConfig.headers
    });

    if (!response.data.response || response.data.response.length === 0) {
      console.log('API de Artilharia retornou uma resposta vazia.');
      return res.json([]);
    }

    const artilhariaFormatada = response.data.response.map(jogador => ({
      id: jogador.player.id,
      jogadora: jogador.player.name,
      time: jogador.statistics[0].team.name,
      logo: jogador.statistics[0].team.logo,
      gols: jogador.statistics[0].goals.total
    }));

    res.json(artilhariaFormatada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar dados da artilharia.' });
  }
});


// Rota para adicionar uma nova notícia
app.post('/api/noticias', (req, res) => {
  // NOTA DE SEGURANÇA: Em uma aplicação real, esta rota deveria ser protegida,
  // verificando se o usuário é um administrador autenticado (usando tokens, por exemplo).

  const { titulo, resumo, conteudo, imagens, destaque } = req.body;
  const dbNoticiasPath = '../client/src/data/mockNoticias.json'; // Caminho corrigido

  if (!titulo || !conteudo || !resumo) {
    return res.status(400).json({ error: 'Título, resumo e conteúdo são obrigatórios.' });
  }

  // Lê o arquivo de notícias existente
  fs.readFile(dbNoticiasPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao ler o banco de dados de notícias.' });
    }

    const noticias = JSON.parse(data);

    const novaNoticia = {
      id: Date.now(), // ID único baseado no tempo
      titulo,
      imagens: imagens || [], // Garante que seja um array, mesmo que vazio
      destaque: destaque || false, // Valor padrão é falso
      resumo,
      conteudo,
    };

    // Adiciona a nova notícia no início da lista
    noticias.unshift(novaNoticia);

    // Salva a lista atualizada de volta no arquivo
    fs.writeFile(dbNoticiasPath, JSON.stringify(noticias, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar a nova notícia.' });
      }
      res.status(201).json({ success: 'Notícia adicionada com sucesso!', noticia: novaNoticia });
    });
  });
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});