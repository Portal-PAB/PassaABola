const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});