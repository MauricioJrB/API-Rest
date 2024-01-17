const express = require('express');
const router = express();
const admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Rota para instalar Administrador automaticamente
router.get('/', async (req, res) => {

        const nome =  process.env.ADMIN_USER;
        const email = "admin@email.com";
        const senha = "admin123";
        
        const Admin = await admin.salvar(nome, email, senha);

        const token = jwt.sign({ id: Admin._id}, process.env.SECRET);

        res.status(200).json({ msg: "Administrador e Banco de Dados instalado com sucesso!", Admin: Admin, token });
});

module.exports = router;