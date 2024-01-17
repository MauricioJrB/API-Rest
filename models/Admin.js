const mongoose = require('../helpers/banco');

const AdminSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
});

const AdminModel = mongoose.model('Admin', AdminSchema);

const salvar = async (nome, email, senha) => {
    return await AdminModel.create({ nome: nome, email: email, senha: senha });
};

const alterar = async(id, nome, email) => {
    return await AdminModel.findByIdAndUpdate(id, {nome: nome, email: email}, {new: true});
};

const deletar = async(id) => {
    return await AdminModel.deleteOne({ _id: id });
};

const buscarID = async(id) => {
    return await AdminModel.findById({ _id: id });
};

const buscarEmail = async (email) => {
    return await AdminModel.findOne({ email: email });
};

const listar = async(id) => {
    return await AdminModel.find({});
};

module.exports = {
    salvar,
    alterar,
    deletar,
    buscarID,
    listar,
    buscarEmail
}

