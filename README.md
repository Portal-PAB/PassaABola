# <p align="center">Passa a Bola ⚽️</p>

Bem-vindo ao repositório do **Passa a Bola**, uma plataforma completa dedicada a celebrar e fortalecer o futebol feminino. Este projeto foi criado para ser um hub central para fãs, jogadoras e organizadores, oferecendo desde notícias e dados de campeonatos até um sistema completo de inscrição para eventos.

**Link da Aplicação:**
* **Vercel:** [Acesse o nosso site](https://passa-a-bola-beryl.vercel.app/).

---

## ✨ Funcionalidades

A plataforma é dividida em duas grandes áreas: a de usuário e a administrativa.

### Para Usuários:
* **Autenticação Completa:** Sistema de cadastro e login de usuários com senhas criptografadas.
* **Perfil Personalizado:** Cada usuária tem uma página de perfil onde pode:
    * Selecionar e salvar seu time do coração.
    * Visualizar dados do time favorito, como tabela de classificação, próximas partidas e artilharia do campeonato.
    * Gerenciar suas inscrições em eventos.
* **Inscrições em Eventos:**
    * **Copa PAB:** Inscrição de times completos ou como jogadora avulsa.
    * **Encontro PAB:** Inscrição individual em eventos e encontros.
* **Conteúdo Informativo:**
    * **Notícias:** Seção de notícias com matérias em destaque e listagem completa.
    * **Jogos e Tabelas:** Visualização de dados de campeonatos, consumidos de uma API externa de futebol.
    * **História:** Página estática com marcos importantes do futebol feminino.

### Para Administradores:
* **Painel de Admin:** Uma área segura para gerenciamento de conteúdo e eventos.
* **Gerenciamento de Copas e Encontros:**
    * Criação de novos eventos, que automaticamente se tornam o "evento aberto" para inscrições.
    * Visualização do histórico de eventos criados.
* **Gerenciamento de Inscrições:**
    * Visualização de todas as equipes e jogadoras avulsas inscritas na copa aberta.
    * **Funcionalidade de Alocação:** O admin pode mover jogadoras avulsas para times que ainda possuem vagas.
    * Exportação da lista de inscritos em formatos **Excel (.xlsx)** e **PDF**.
* **Gerenciamento de Notícias:**
    * Criação, edição e listagem de notícias.
    * Sistema para marcar uma notícia como "destaque" do dia.

---

## 💻 Tech Stack

O projeto utiliza tecnologias modernas, separando as responsabilidades entre frontend, backend e banco de dados.

| Frontend                               | Backend                               | Banco de Dados | Deploy                        |
| -------------------------------------- | ------------------------------------- | -------------- | ----------------------------- |
| **React (Vite)** | **Node.js** | **PostgreSQL** | **Vercel** (Frontend)         |
| **React Router** | **Express.js** |                | **Render** (Backend + DB)     |
| **Tailwind CSS** | **`node-postgres` (pg)** |                |                               |
| **`fetch` API** | **`bcrypt`** (Password Hashing)       |                |                               |
| **`react-fontawesome`** | **`dotenv`** (Environment Variables)  |                |                               |
| **Context API** (para Autenticação)    | **`exceljs` & `pdfkit`** (Exports)    |                |                               |

---

## 📁 Estrutura do Projeto

O projeto segue uma estrutura de monorepo, com o código do cliente e do servidor separados em pastas distintas na raiz do projeto.

```
/passa-a-bola
│
├── 📂 client/
│   ├── /src
│   │   ├── /assets
│   │   ├── /components
│   │   ├── /context
│   │   ├── /pages
│   │   ├── App.jsx
│   │   ├── index.css
│   ├── .gitignore
│   ├── index.html
│   ├── vercel.json
│   ├── package.json
│
├── 📂 server/
│   ├── index.js
│   ├── init-db.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│
├── LICENSE
├── README.md

```


## 🐌 Performance (Plano Gratuito)
Este projeto está publicado utilizando os planos gratuitos do Render (para o backend e banco de dados).

* Hibernação do Servidor: Serviços no plano gratuito são "congelados" (hibernam) após um período de inatividade. Quando uma nova requisição chega, o Render precisa "acordar" o servidor, um processo que pode levar de 30 segundos a um minuto.

* Primeira Requisição Lenta: Como resultado, a primeira visita ao site ou a primeira ação que depende da API (como fazer login) pode demorar bastante para carregar.

* Navegação Pós-Inicialização: Após o servidor "acordar", as requisições seguintes são processadas sem o atraso inicial. No entanto, a navegação geral do site ainda pode ser um pouco lenta devido aos recursos limitados do plano gratuito.

---

## 🔮 Melhorias Futuras

[ ] Finalizar o Painel de Admin para Gerenciamento Manual de Jogos e Tabelas: Permitir que administradores possam adicionar jogos, atualizar resultados e criar tabelas de classificação para campeonatos que não são cobertos pela API externa.

[ ] Desenvolver a Galeria de Fotos: Criar uma seção onde as fotos dos eventos (Copas e Encontros) possam ser publicadas e visualizadas pelos usuários.

[ ] Implementar a visualização de Chaveamentos: Desenvolver a interface para exibir os chaveamentos e o mata-mata das Copas PAB, mostrando o progresso dos times no torneio.