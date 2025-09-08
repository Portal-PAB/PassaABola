require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = 3001;


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


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});