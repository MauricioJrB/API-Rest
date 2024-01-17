const express = require('express');
const app = express();
const cadastrarRouter = require('./routes/cadastrar');
const installRouter = require('./routes/install');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', cadastrarRouter);
app.use('/instalar', installRouter);

app.get('/teste', (req, res) => {
    res.status(200).json({ msg: "Bem vindo a API!" });
});

app.listen(8000, () => {
    console.log("Servidor rodando na porta http://localhost:8000");
});