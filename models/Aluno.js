const mongoose = require('../helpers/banco');
const PersonalModel = require('../models/Personal');

const AlunoSchema = new mongoose.Schema({   
    nome : String,
    personal: mongoose.Schema.Types.ObjectId, ref: "Personal" 
});

const AlunoModel = mongoose.model("Aluno", AlunoSchema);

const salvar = async (nome, personal) => { 
    const personal = await PersonalModel.findOne({ nome: personal });
    return await AlunoModel.create({ nome, personal: personal });
};

const alterar = async (id, nome) => {
    return await AlunoModel.findByIdAndUpdate(id, nome, {new: true });
};

const deletar = async (id) => {
    return await AlunoModel.findByIdAndDelete(id);
};

const buscar = async(nome) => {
    return await AlunoModel.findOne({ nome: nome });
};

const buscarID = async (id) => {
    return await AlunoModel.findById(id);
};

const paginarDados = async (limite, contador) => {
    return await AlunoModel.find().skip(contador).limit(limite);
};

module.exports = {
    salvar,
    alterar,
    deletar,
    buscar,
    buscarID,
    paginarDados
};
