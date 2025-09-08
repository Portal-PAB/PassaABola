// Importando as ferramentas
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Configurações iniciais
const app = express();
const PORT = 3001;
const saltRounds = 10;

app.use(cors()); 
app.use(express.json());

const dbPath = './contas.json';

// Rota de cadastro
app.post('/cadastro', (req, res) => {
  // Pega os dados que o front-end enviou (nome, email, senha)
  const { nome, email, senha } = req.body;

  // Validação simples para garantir que todos os campos foram enviados
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Lê o arquivo contas.json
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: 'Erro ao ler o banco de dados.' });
    }

    const contas = data ? JSON.parse(data) : [];

    // Verifica se o email já foi cadastrado
    if (contas.find(conta => conta.email === email)) {
      return res.status(400).json({ error: 'Este email já está em uso.' });
    }

    // Criptografa a senha antes de salvar
    bcrypt.hash(senha, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao proteger a senha.' });
      }

      // Adiciona o novo usuário à lista
      contas.push({ nome, email, senhaHash: hash });

      // Escreve a lista atualizada de volta no arquivo
      fs.writeFile(dbPath, JSON.stringify(contas, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro ao salvar a conta.' });
        }
        res.status(201).json({ success: 'Conta criada com sucesso!' });
      });
    });
  });
});

// Rota de Login
app.post('/login', (req, res) => {
  // Pega os dados que o front-end enviou (email, senha)
  const { email, senha } = req.body;

  // Validação simples
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  // Lê o JSON
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      // Se o arquivo não existir ou der erro.
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const contas = JSON.parse(data);

    // Encontra o usuário pelo email
    const conta = contas.find(c => c.email === email);
    if (!conta) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Compara a senha enviada com o hash salvo no arquivo
    bcrypt.compare(senha, conta.senhaHash, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no servidor.' });
      }
      if (result) {
        // A senha corresponde!
        res.status(200).json({ success: 'Login bem-sucedido!' });
      } else {
        // A senha não corresponde.
        res.status(401).json({ error: 'Senha incorreta.' });
      }
    });
  });
});


app.post('/inscricao-copa', (req, res) => {
  // Adiciona 'nomeTime' aos campos recebidos
  const { nomeTime, responsavel, cpf, email, telefone, jogadoras } = req.body;
  const dbEquipesPath = './equipes.json';

  // Adiciona 'nomeTime' à validação
  if (!nomeTime || !responsavel || !cpf || !email || !jogadoras || jogadoras.length === 0) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  const novaEquipe = {
    id: Date.now(),
    nomeTime, // <-- Adicionado o novo campo
    responsavel,
    cpf,
    email,
    telefone,
    jogadoras,
    data_inscricao: new Date().toISOString(),
  };

  // O resto da função continua igual...
  fs.readFile(dbEquipesPath, 'utf8', (err, data) => {
    // ...
    const equipes = data ? JSON.parse(data) : [];
    equipes.push(novaEquipe);
    // ...
    fs.writeFile(dbEquipesPath, JSON.stringify(equipes, null, 2), (err) => {
      // ...
    });
  });
});

app.post('/inscricao-jogadora', (req, res) => {
  const { nome, cpf, email, telefone } = req.body;
  const dbJogadorasPath = './jogadorasSemTime.json';

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


// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});