const mongoose = require('../helpers/banco');

const PersonalSchema = new mongoose.Schema({ nome: String });

const PersonalModel = mongoose.model("Personal", PersonalSchema);

const salvar = async (nome) => {
    return await PersonalModel.create(nome);
};

const alterar = async (id, nome) => {
    return await PersonalModel.findByIdAndUpdate(id, {nome: nome}, {new: true });
};

const deletar = async (id) => {
    return PersonalModel.findByIdAndDelete(id);
};

const buscar = async (nome) => {
    return await PersonalModel.findOne({ nome: nome });
};

const buscarID = async (id) => {
    return await PersonalModel.findById(id);
};

const listar = async () => {
    return await PersonalModel.find();
};

const paginarDados = async (limite, contador) => {
    return await PersonalModel.find().skip
    (contador).limit(limite);
};

module.exports = {
    salvar,
    alterar,
    deletar,
    buscar,
    buscarID,
    listar,
    paginarDados
};