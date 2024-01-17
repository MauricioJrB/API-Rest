const mongoose = require('../helpers/banco');

const UserSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
});

const UserModel = mongoose.model('User', UserSchema);

const salvar = async(nome, email, senha) => {
    return await UserModel.create({ nome: nome, email: email, senha: senha });
};

const alterar = async(id, nome, email) => {
    return await UserModel.findByIdAndUpdate(id, {nome: nome, email: email}, {new: true});
};

const deletar = async(id) => {
    return await UserModel.findByIdAndDelete(id);
};

const buscarID = async(id) => {
    return await UserModel.findOne({ _id: id });
};

const buscarEmail = async(email) => {
    return await UserModel.findOne({ email: email });
};

const listar = async(id) => {
    return await UserModel.find({});
};

module.exports = {
    salvar,
    alterar,
    deletar,
    buscarID,
    listar,
    buscarEmail
};

