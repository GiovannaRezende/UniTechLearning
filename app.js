import express from 'express'
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //ADICIONADA ESTA LINHA

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/components', express.static(path.join(__dirname, 'components')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Página inicial apontando para o HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/registerUser/index.html'));
});


async function criar_usuario (nome, sobrenome, email, senha) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,

    });
    await db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY, nome TEXT, sobrenome TEXT, email, senha)`

    );

   await db.run(`INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)`, [nome, sobrenome, email, senha])

}

app.post('/cadastrar', async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  try {
    await criar_usuario(nome, sobrenome, email, senha);
    res.status(200).send('Usuário cadastrado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar');
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const db = await open({
      filename: './banco.db',
      driver: sqlite3.Database
    });

    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

    // if (!usuario) {
    //   // redireciona para página de cadastro
    //   return res.redirect('/pages/registerUser/index.html');
    // }

    if (!usuario) {
      return res.send('<script>alert("E-mail não encontrado. Por favor, crie uma conta."); window.location.href="/pages/registerUser/index.html";</script>');
    }

    if (usuario.senha !== senha) {
      return res.send('<script>alert("Senha incorreta."); window.location.href="/pages/login/index.html";</script>');
    }

    return res.redirect('/pages/courses/index.html');

  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no servidor');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

