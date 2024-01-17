const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.DB_USER;
const password = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${username}:${password}@api-finalproject.qlibsfs.mongodb.net/`
    ).then(() => {
        console.log("Conectado ao Banco de Dados.");
    }).catch((error) => {
        console.log("Erro ao conectar ao Banco de Dados.", error);
    });

module.exports = mongoose;