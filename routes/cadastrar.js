const express = require('express');
const router = express.Router();
const users = require('../models/User');
const admins = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { validaPost, validaLogin, isAdmin, validaID, isAuth } = require('../helpers/validaCadastro');

router.get('/', (req, res) => {
    res.status(200).json({ msg: "Rota de Cadastro" });
});

router.post('/cadastrar', validaPost, async (req, res) => {
    
    try {
        const { nome, email, senha, confirmeSenha } = req.body;
        const user = await users.salvar(nome, email, senha);

        res.status(201).json({ msg: "Usuário criado com sucesso !", user: user });
    }
    catch(e) {
        res.status(500).json({ erro: "Erro no servidor!" });
    }
});

router.post('/login', validaLogin, async (req, res) => {
    try {
        const { email, senha } = req.body;

        const admin = await admins.buscarEmail(email);
        const user = await users.buscarEmail(email);

        let autenticar;

        if (admin && admin.senha === senha) {
            autenticar = admin;
        } 
        else if (user && user.senha === senha) {  
            autenticar = user;
        } 
     
        const token = jwt.sign({ id: autenticar._id}, process.env.SECRET, { expiresIn: '12h' });
        res.status(200).json({ msg: "Login realizado com sucesso!", token });
        console.log("Token: ", token);
    } 
    catch (e) {
        res.status(500).json({ erro: "Senha invalida!" });    
    }
});

router.post('/criarAdmin', validaPost, isAdmin, async (req, res) => {
    const { nome, email, senha, confirmeSenha } = req.body;
    try {
        const newAdmin = await admins.salvar(nome, email, senha);
        console.log("novo adm", newAdmin)
        res.status(200).json({ msg: "Administrador criado com sucesso!", Novo_Admin: newAdmin });
    }
    catch(e) {
        res.status(500).json({ erro: "Erro no servidor!" });
    }
});

// alterar usuario 
router.put('/alterar/:id', validaID, isAuth, async (req, res) => {
    const id = req.params.id;
    const { nome, email } = req.body;
    if (!nome) {
        return res.status(400).json({ msg: "Informe o novo nome do usuário ou administrador" });
    }
    if (!email) {
        return res.status(400).json({ msg: "Informe um e-mail válido para atualizar" });
    }
    try {
        if (req.admin || (req.user && req.user._id.toString() === id)) {
            if (req.admin) {
                if (await admins.buscarID(id)) {
                    let altAdmin = await admins.alterar(id, nome, email);
                    res.status(200).json({ msg: "Administrador alterado com sucesso!", Admin: altAdmin });
                }  
                if (await users.buscarID(id)) {
                    let altUser = await users.alterar(id, nome, email);
                    res.status(200).json({ msg: "Usuário alterado pelo Adminstrador com sucesso!", User: altUser });
                }
            } 
            else {
                let altUser= await users.alterar(id, nome, email);
                res.status(200).json({ msg: "Usuário alterado com sucesso!", User: altUser });
            }
        } 
        else {
            res.status(401).json({ erro: "Não autorizado!" });
        }
    } catch (e) {
        res.status(500).json({ erro: "Erro no servidor!" });
    }
});

router.get('/buscar/:id', async (req, res) => {

    const id = req.params.id;

    try {
        const admin = await admins.buscarID(id);
        const user = await users.buscarID(id);
        if(admin) {
            res.status(200).json({ msg: "Administrador encontrado: ", admin: admin });
        } 
        else if(user) {
            res.status(200).json({ msg: "Usuário encontrado: ", User: user });
        }
        else {
            res.status(400).json({ msg: "ID Não encontrado! "});
        }
    }
    catch(e) {
        res.status(500).json({ erro: "Erro no servidor! "});
    }
});

router.delete('/deletar/:id',  validaID, isAdmin, isAuth, async (req, res) => {
    const id = req.params.id;

    try {
        const admin = await admins.buscarID(id);
        const user = await users.buscarID(id);

        if (admin) {
            await admins.deletar(id);
            return res.status(200).json({ msg: "Administrador deletado com sucesso!" });
        } 
        else if (user) {
            await users.deletar(id);
            return res.status(200).json({ msg: "Usuário deletado com sucesso!" });
        } 
        else {
            return res.status(400).json({ msg: "Os dados já foram deletados!" });
        }
    } 
    catch (e) {
        res.status(400).json({ msg: "ID Não encontrado!" });
    }
});

module.exports = router;