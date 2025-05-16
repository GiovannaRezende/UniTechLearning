import express from 'express'
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

