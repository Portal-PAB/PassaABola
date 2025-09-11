require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios');

const app = express();
const PORT = 3001;
const saltRounds = 10;

const dataDir = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

// --- Funções Auxiliares para ler/escrever arquivos JSON ---
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeJsonFile = (filePath, data) => {
  return fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// --- Rotas de Autenticação ---
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, cpf } = req.body; // 1. Adicione 'cpf' aqui
  const dbPath = path.join(dataDir, 'contas.json');
  if (!nome || !email || !senha || !cpf) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  
  const contas = await readJsonFile(dbPath);
  if (contas.find(conta => conta.email === email || conta.cpf === cpf)) return res.status(400).json({ error: 'Este email ou CPF já está em uso.' });

  const hash = await bcrypt.hash(senha, saltRounds);
  contas.push({ nome, email, cpf, senhaHash: hash });
  await writeJsonFile(dbPath, contas);
  res.status(201).json({ success: 'Conta criada com sucesso!' });
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    const dbPath = path.join(dataDir, 'contas.json');
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  
    const contas = await readJsonFile(dbPath);
    const conta = contas.find(c => c.email === email);
    if (!conta) return res.status(404).json({ error: 'Usuário não encontrado.' });
  
    const match = await bcrypt.compare(senha, conta.senhaHash);
    if (match) {
      res.status(200).json({ success: 'Login bem-sucedido!' });
    } else {
      res.status(401).json({ error: 'Senha incorreta.' });
    }
});


// --- Rotas de Gerenciamento de Copas ---
app.post('/api/copas', async (req, res) => {
    const { nome, data, local, limiteEquipes } = req.body;
    const dbCopasPath = path.join(dataDir, 'copas.json');
    if (!nome || !data || !local || !limiteEquipes) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

    let copas = await readJsonFile(dbCopasPath);
    copas = copas.map(copa => ({ ...copa, status: 'fechada' }));
    
    const novaCopa = { id: Date.now(), nome, data, local, limiteEquipes, status: 'aberta' };
    copas.push(novaCopa);

    await writeJsonFile(dbCopasPath, copas);
    res.status(201).json({ success: 'Copa criada e aberta para inscrições!', copa: novaCopa });
});

app.get('/api/copas/aberta', async (req, res) => {
    const dbCopasPath = path.join(dataDir, 'copas.json');
    const copas = await readJsonFile(dbCopasPath);
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    res.json(copaAberta || null);
});

app.get('/api/copas', async (req, res) => {
    const dbCopasPath = path.join(dataDir, 'copas.json');
    const copas = await readJsonFile(dbCopasPath);
    res.json(copas);
});


// --- Rotas de Gerenciamento de Encontros ---
app.post('/api/encontros', async (req, res) => {
  const { nome, data, local, limiteInscritos } = req.body;
  const dbEncontrosPath = path.join(dataDir, 'encontros.json');
  if (!nome || !data || !local || !limiteInscritos) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });

  let encontros = await readJsonFile(dbEncontrosPath);
  encontros = encontros.map(encontro => ({ ...encontro, status: 'fechada' }));
  
  const novoEncontro = { id: Date.now(), nome, data, local, limiteInscritos: parseInt(limiteInscritos), status: 'aberta' };
  encontros.push(novoEncontro);

  await writeJsonFile(dbEncontrosPath, encontros);
  res.status(201).json({ success: 'Encontro criado e aberto para inscrições!', encontro: novoEncontro });
});

app.get('/api/encontros/aberto', async (req, res) => {
    const dbEncontrosPath = path.join(dataDir, 'encontros.json');
    const encontros = await readJsonFile(dbEncontrosPath);
    const encontroAberto = encontros.find(encontro => encontro.status === 'aberta');
    res.json(encontroAberto || null);
});

app.get('/api/encontros', async (req, res) => {
    const dbEncontrosPath = path.join(dataDir, 'encontros.json');
    const encontros = await readJsonFile(dbEncontrosPath);
    res.json(encontros);
});

app.get('/api/encontros/:id/inscritos', async (req, res) => {
    const encontroId = req.params.id;
    const dbInscricoesPath = path.join(dataDir, `encontro-${encontroId}-inscricoes.json`);
    const inscricoes = await readJsonFile(dbInscricoesPath);
    res.json(inscricoes);
});


// --- Rotas de Inscrição ---
app.post('/inscricao-copa', async (req, res) => {
    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (!copaAberta) return res.status(403).json({ error: 'Nenhuma copa aberta para inscrições no momento.' });

    const { nomeTime, responsavel, cpf, email, telefone, jogadoras } = req.body;
    const dbEquipesPath = path.join(dataDir, `copa-${copaAberta.id}-equipes.json`);

    const novaEquipe = { id: Date.now(), nomeTime, responsavel, cpf, email, telefone, jogadoras, data_inscricao: new Date().toISOString() };
    const equipes = await readJsonFile(dbEquipesPath);
    equipes.push(novaEquipe);
    await writeJsonFile(dbEquipesPath, equipes);

    res.status(201).json({ success: 'Inscrição realizada com sucesso!' });
});

app.post('/inscricao-jogadora', async (req, res) => {
    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (!copaAberta) return res.status(403).json({ error: 'Nenhuma copa aberta para inscrições no momento.' });

    const { nome, cpf, email, telefone } = req.body;
    const dbJogadorasPath = path.join(dataDir, `copa-${copaAberta.id}-avulsas.json`);

    const novaJogadora = { id: Date.now(), nome, cpf, email, telefone, data_inscricao: new Date().toISOString() };
    const jogadoras = await readJsonFile(dbJogadorasPath);
    jogadoras.push(novaJogadora);
    await writeJsonFile(dbJogadorasPath, jogadoras);

    res.status(201).json({ success: 'Inscrição realizada com sucesso!' });
});

// --- ROTA DE INSCRIÇÃO PARA ENCONTRO ---
app.post('/inscricao-encontro', async (req, res) => {
    const encontros = await readJsonFile(path.join(dataDir, 'encontros.json'));
    const encontroAberto = encontros.find(encontro => encontro.status === 'aberta');
    if (!encontroAberto) return res.status(403).json({ error: 'Nenhum encontro aberto para inscrições.' });

    const { nome, cpf, email, telefone } = req.body;
    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    const dbInscricoesPath = path.join(dataDir, `encontro-${encontroAberto.id}-inscricoes.json`);
    const inscricoes = await readJsonFile(dbInscricoesPath);

    // Verifica o limite de inscritos
    if (inscricoes.length >= encontroAberto.limiteInscritos) {
        return res.status(403).json({ error: 'Inscrições esgotadas para este encontro.' });
    }

    // Verifica se o usuário já está inscrito
    if (inscricoes.find(insc => insc.email === email)) {
        return res.status(409).json({ error: 'Você já está inscrito neste encontro.' });
    }

    const novaInscricao = {
        id: Date.now(),
        nome,
        cpf,
        email,
        telefone,
        data_inscricao: new Date().toISOString()
    };

    inscricoes.push(novaInscricao);
    await writeJsonFile(dbInscricoesPath, inscricoes);

    res.status(201).json({ success: 'Inscrição no encontro realizada com sucesso!' });
});



// ROTA PARA BUSCAR OS INSCRITOS DE UM ENCONTRO
app.get('/api/encontros/aberto/inscricoes', async (req, res) => {
    const encontros = await readJsonFile(path.join(dataDir, 'encontros.json'));
    const encontroAberto = encontros.find(encontro => encontro.status === 'aberta');
    if (!encontroAberto) return res.json([]); // Retorna vazio se não há encontro

    const dbInscricoesPath = path.join(dataDir, `encontro-${encontroAberto.id}-inscricoes.json`);
    const inscricoes = await readJsonFile(dbInscricoesPath);
    res.json(inscricoes);
});


// --- Rotas de Admin para Visualizar Inscrições de Copa ---
const getOpenCupFiles = async () => {
    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (!copaAberta) return { equipesFile: null, jogadorasFile: null };
    return {
        equipesFile: path.join(dataDir, `copa-${copaAberta.id}-equipes.json`),
        jogadorasFile: path.join(dataDir, `copa-${copaAberta.id}-avulsas.json`)
    };
};

app.get('/api/equipes', async (req, res) => {
    const { equipesFile } = await getOpenCupFiles();
    if (!equipesFile) return res.json([]);
    const equipes = await readJsonFile(equipesFile);
    res.json(equipes);
});

app.get('/api/jogadoras-avulsas', async (req, res) => {
    const { jogadorasFile } = await getOpenCupFiles();
    if (!jogadorasFile) return res.json([]);
    const jogadoras = await readJsonFile(jogadorasFile);
    res.json(jogadoras);
});

app.post('/api/equipes/:id/adicionar-jogadora', async (req, res) => {
    const { equipesFile, jogadorasFile } = await getOpenCupFiles();
    if (!equipesFile || !jogadorasFile) return res.status(403).json({ error: "Nenhuma copa aberta para gerenciar." });

    const timeId = parseInt(req.params.id);
    const jogadoraParaAdicionar = req.body;

    let equipes = await readJsonFile(equipesFile);
    let jogadorasAvulsas = await readJsonFile(jogadorasFile);
    
    const indexEquipe = equipes.findIndex(e => e.id === timeId);
    if (indexEquipe === -1) return res.status(404).json({ error: 'Equipe não encontrada.' });
    
    equipes[indexEquipe].jogadoras.push({ nome: jogadoraParaAdicionar.nome, cpf: jogadoraParaAdicionar.cpf });
    const jogadorasAvulsasAtualizada = jogadorasAvulsas.filter(j => j.id !== jogadoraParaAdicionar.id);

    await writeJsonFile(equipesFile, equipes);
    await writeJsonFile(jogadorasFile, jogadorasAvulsasAtualizada);
    
    res.json({ success: 'Jogadora adicionada com sucesso!' });
});


// --- Rotas de Gerenciamento de Notícias ---
const dbNoticiasPath = path.join(__dirname, '..', 'client', 'src', 'data', 'mockNoticias.json');

app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await readJsonFile(dbNoticiasPath);
    res.json(noticias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o banco de dados de notícias.' });
  }
});

app.get('/api/noticias/:id', async (req, res) => {
  try {
    const noticiaId = parseInt(req.params.id);
    const noticias = await readJsonFile(dbNoticiasPath);
    const noticia = noticias.find(n => n.id === noticiaId);
    if (noticia) {
      res.json(noticia);
    } else {
      res.status(404).json({ error: 'Notícia não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler o banco de dados.' });
  }
});

app.post('/api/noticias', async (req, res) => {
  try {
    const { titulo, resumo, conteudo, imagens, destaque } = req.body;
    if (!titulo || !conteudo || !resumo) {
      return res.status(400).json({ error: 'Título, resumo e conteúdo são obrigatórios.' });
    }
    const noticias = await readJsonFile(dbNoticiasPath);
    const novaNoticia = { id: Date.now(), titulo, imagens: imagens || [], destaque: destaque || false, resumo, conteudo };
    noticias.unshift(novaNoticia);
    await writeJsonFile(dbNoticiasPath, noticias);
    res.status(201).json({ success: 'Notícia adicionada com sucesso!', noticia: novaNoticia });
  } catch (error) {
    console.error("Erro em POST /api/noticias:", error);
    res.status(500).json({ error: 'Erro ao salvar a nova notícia.' });
  }
});

app.put('/api/noticias/:id', async (req, res) => {
  try {
    const noticiaId = parseInt(req.params.id);
    const noticiaAtualizada = req.body;
    let noticias = await readJsonFile(dbNoticiasPath);
    const index = noticias.findIndex(n => n.id === noticiaId);
    if (index === -1) return res.status(404).json({ error: 'Notícia não encontrada para atualizar.' });
    noticias[index] = { ...noticiaAtualizada, id: noticiaId };
    await writeJsonFile(dbNoticiasPath, noticias);
    res.json({ success: 'Notícia atualizada com sucesso!', noticia: noticias[index] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a notícia.' });
  }
});

app.patch('/api/noticias/:id/toggle-destaque', async (req, res) => {
  try {
    const noticiaId = parseInt(req.params.id);
    let noticias = await readJsonFile(dbNoticiasPath);
    const index = noticias.findIndex(n => n.id === noticiaId);
    if (index === -1) return res.status(404).json({ error: 'Notícia não encontrada.' });
    noticias[index].destaque = !noticias[index].destaque;
    await writeJsonFile(dbNoticiasPath, noticias);
    res.json({ success: 'Status de destaque alterado!', noticia: noticias[index] });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a alteração.' });
  }
});


// --- Rotas da API-Football ---
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
      return res.json([]);
    }
    const tabelaFormatada = response.data.response[0].league.standings[0].map(item => ({
      pos: item.rank,
      time: { nome: item.team.name, logo: item.team.logo },
      P: item.points, J: item.all.played, V: item.all.win,
      E: item.all.draw, D: item.all.lose, GP: item.all.goals.for,
      GC: item.all.goals.against, SG: item.goalsDiff
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


// ... (após as rotas existentes)

// ROTA PARA BUSCAR DADOS COMPLETOS DE UM USUÁRIO (PARA O CONTEXTO)
app.get('/api/usuario/:email', async (req, res) => {
    const userEmail = req.params.email;
    const dbPath = path.join(dataDir, 'contas.json');
    const contas = await readJsonFile(dbPath);
    const conta = contas.find(c => c.email === userEmail);
    if (conta) {
        // Não enviamos o hash da senha, por segurança
        const { senhaHash, ...userData } = conta;
        res.json(userData);
    } else {
        res.status(404).json({ error: 'Usuário não encontrado.' });
    }
});

// ROTA PARA SALVAR O TIME FAVORITO DE UM USUÁRIO
app.post('/api/usuario/favoritar-time', async (req, res) => {
    const { email, timeId } = req.body;
    const dbPath = path.join(dataDir, 'contas.json');
    let contas = await readJsonFile(dbPath);
    const userIndex = contas.findIndex(c => c.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    
    contas[userIndex].timeFavoritoId = timeId;

    await writeJsonFile(dbPath, contas);

    const { senhaHash, ...updatedUser } = contas[userIndex];
    res.json({ success: 'Time favorito salvo com sucesso!', user: updatedUser });
});

// ROTA PARA BUSCAR TODOS OS TIMES DE UMA LIGA
app.get('/api/ligas/:leagueId/times', async (req, res) => {
    const { leagueId } = req.params;
    const options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/teams',
        params: { league: leagueId, season: '2023' },
        headers: apiConfig.headers
    };
    try {
        const response = await axios.request(options);
        res.json(response.data.response);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar times da liga.' });
    }
});

// ROTA PARA BUSCAR PARTIDAS DE UM TIME ESPECÍFICO
app.get('/api/times/:timeId/partidas', async (req, res) => {
    const { timeId } = req.params;
    const options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/fixtures',
        params: { team: timeId, season: '2023' }, // Próximas 5 partidas
        headers: apiConfig.headers
    };
    try {
        const response = await axios.request(options);
        const partidasFormatadas = response.data.response.map(partida => ({
            id: partida.fixture.id,
            campeonato: partida.league.name,
            timeCasa: { nome: partida.teams.home.name, logo: partida.teams.home.logo },
            timeFora: { nome: partida.teams.away.name, logo: partida.teams.away.logo },
            data: new Date(partida.fixture.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            hora: new Date(partida.fixture.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }));
        res.json(partidasFormatadas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar partidas do time.' });
    }
});


// ROTA PARA BUSCAR TODAS AS INSCRIÇÕES DE UM USUÁRIO (VERSÃO ATUALIZADA)
app.get('/api/usuario/minhas-inscricoes/:email', async (req, res) => {
    const { email } = req.params;
    let inscricoes = { copa: null, encontro: null, copaAvulsa: null }; // Adicionado copaAvulsa

    const contas = await readJsonFile(path.join(dataDir, 'contas.json'));
    const usuarioLogado = contas.find(c => c.email === email);
    if (!usuarioLogado) return res.json(inscricoes);
    const cpfUsuarioLogado = usuarioLogado.cpf;

    // --- Lógica para Copa (Time e Avulsa) ---
    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (copaAberta) {
        // 1. Verifica se é responsável por um time
        const equipesFile = path.join(dataDir, `copa-${copaAberta.id}-equipes.json`);
        const equipes = await readJsonFile(equipesFile);
        let equipeEncontrada = equipes.find(e => e.email === email);
        if (equipeEncontrada) {
            inscricoes.copa = { ...equipeEncontrada, role: 'responsavel' };
        } else {
            // 2. Se não, verifica se está como jogadora em um time
            equipeEncontrada = equipes.find(e => e.jogadoras.some(j => j.cpf === cpfUsuarioLogado));
            if (equipeEncontrada) {
                inscricoes.copa = { ...equipeEncontrada, role: 'jogadora' };
            }
        }
        
        // 3. VERIFICA SE ESTÁ INSCRITA COMO AVULSA NA COPA
        const jogadorasAvulsasFile = path.join(dataDir, `copa-${copaAberta.id}-avulsas.json`);
        const jogadorasAvulsas = await readJsonFile(jogadorasAvulsasFile);
        const inscricaoAvulsa = jogadorasAvulsas.find(j => j.email === email);
        if (inscricaoAvulsa) {
            inscricoes.copaAvulsa = { ...inscricaoAvulsa, nomeCopa: copaAberta.nome };
        }
    }

    // --- Lógica para Encontro ---
    const encontros = await readJsonFile(path.join(dataDir, 'encontros.json'));
    const encontroAberto = encontros.find(encontro => encontro.status === 'aberta');
    if (encontroAberto) {
        const inscricoesFile = path.join(dataDir, `encontro-${encontroAberto.id}-inscricoes.json`);
        const inscricoesEncontro = await readJsonFile(inscricoesFile);
        const inscricaoUsuario = inscricoesEncontro.find(i => i.email === email);
        if(inscricaoUsuario) inscricoes.encontro = { ...inscricaoUsuario, nomeEncontro: encontroAberto.nome };
    }

    res.json(inscricoes);
});

// ROTA PARA DELETAR UMA INSCRIÇÃO DE TIME DE UMA COPA (pelo email do responsável)
app.delete('/api/inscricao-copa/:email', async (req, res) => {
    const { email } = req.params;
    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (!copaAberta) return res.status(404).json({ error: 'Nenhuma copa aberta encontrada.' });

    const equipesFile = path.join(dataDir, `copa-${copaAberta.id}-equipes.json`);
    const equipes = await readJsonFile(equipesFile);
    
    const equipesAtualizadas = equipes.filter(e => e.email !== email);

    await writeJsonFile(equipesFile, equipesAtualizadas);
    res.json({ success: 'Inscrição da equipe cancelada com sucesso.' });
});

// ROTA PARA DELETAR UMA INSCRIÇÃO DE UM ENCONTRO
app.delete('/api/inscricao-encontro/:email', async (req, res) => {
    const { email } = req.params;
    const encontros = await readJsonFile(path.join(dataDir, 'encontros.json'));
    const encontroAberto = encontros.find(encontro => encontro.status === 'aberta');
    if (!encontroAberto) return res.status(404).json({ error: 'Nenhum encontro aberto encontrado.' });

    const inscricoesFile = path.join(dataDir, `encontro-${encontroAberto.id}-inscricoes.json`);
    const inscricoes = await readJsonFile(inscricoesFile);

    const inscricoesAtualizadas = inscricoes.filter(i => i.email !== email);
    
    await writeJsonFile(inscricoesFile, inscricoesAtualizadas);
    res.json({ success: 'Inscrição no encontro cancelada com sucesso.' });
});

// NOVA ROTA PARA JOGADORA INDIVIDUAL CANCELAR PARTICIPAÇÃO EM TIME
app.delete('/api/equipes/:timeId/jogadora/:cpf', async (req, res) => {
    const { timeId, cpf } = req.params;

    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (!copaAberta) return res.status(404).json({ error: 'Nenhuma copa aberta.' });

    const equipesFile = path.join(dataDir, `copa-${copaAberta.id}-equipes.json`);
    let equipes = await readJsonFile(equipesFile);

    const indexEquipe = equipes.findIndex(e => e.id === parseInt(timeId));
    if (indexEquipe === -1) return res.status(404).json({ error: 'Equipe não encontrada.' });
    
    const jogadorasAntes = equipes[indexEquipe].jogadoras.length;
    equipes[indexEquipe].jogadoras = equipes[indexEquipe].jogadoras.filter(j => j.cpf !== cpf);
    const jogadorasDepois = equipes[indexEquipe].jogadoras.length;

    if (jogadorasAntes === jogadorasDepois) {
        return res.status(404).json({ error: 'Jogadora com este CPF não encontrada no time.' });
    }

    await writeJsonFile(equipesFile, equipes);
    res.json({ success: 'Sua participação foi cancelada com sucesso.' });
});

// ROTA PARA CANCELAR INSCRIÇÃO AVULSA NA COPA
app.delete('/api/inscricao-jogadora/:email', async (req, res) => {
    const { email } = req.params;
    const copas = await readJsonFile(path.join(dataDir, 'copas.json'));
    const copaAberta = copas.find(copa => copa.status === 'aberta');
    if (!copaAberta) return res.status(404).json({ error: 'Nenhuma copa aberta encontrada.' });

    const avulsasFile = path.join(dataDir, `copa-${copaAberta.id}-avulsas.json`);
    const jogadoras = await readJsonFile(avulsasFile);

    const jogadorasAtualizadas = jogadoras.filter(j => j.email !== email);
    
    await writeJsonFile(avulsasFile, jogadorasAtualizadas);
    res.json({ success: 'Inscrição avulsa na copa cancelada com sucesso.' });
});


// --- Inicia o servidor ---
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});