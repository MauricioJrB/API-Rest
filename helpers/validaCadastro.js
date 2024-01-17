const AdminModel = require('../models/Admin');
const UserModel =require('../models/User');
const jwt = require('jsonwebtoken');

async function validaID (req, res, next) {
    const id = req.params.id;

    if(!id || id === null || id=== undefined) {   
        return res.status(400).send({ msg: "ID não informado!" });
    }
    next();
}
async function validaPost (req, res, next) {
    const { nome, email, senha, confirmeSenha } = req.body;

    const emailAdmin = await AdminModel.buscarEmail(email);
    const emailUser = await UserModel.buscarEmail(email);

    if (!nome) {
        return res.status(400).json({ msg: "O nome é obrigatório!" });
    }
    if(!email) {
       return res.status(400).json({ msg:"O e-mail é obrigatório!" });
    }    
    if(emailAdmin || emailUser) {
        return res.status(400).json({ msg: "Email já foi registrado! Insira outro!"});
    }
    if (!senha) {
        return res.status(400).json({ msg: "A senha é obrigatória!" });
    }
    if(!confirmeSenha) {
        return res.status(400).json({ msg: "Confirmação de Senha é obrigatória!" });
    }
    if (senha !== confirmeSenha){
        return res.status(400).json({ msg: "As senhas não são iguais!" });
    }
    next();
};

async function validaLogin(req, res, next) {
    const { email, senha } = req.body;
    const emailAdmin = await AdminModel.buscarEmail(email);
    const emailUser = await UserModel.buscarEmail(email);

    if(!email) {
        return res.status(400).json({ msg: "O e-mail é obrigatório!" });
    }
    if(!emailAdmin && !emailUser) {
        return res.status(400).json({ msg: "Email não encontrado!!" });
    }
    if (!senha) {
        return res.status(400).json({ msg: "A senha é obrigatória!" });
    }
    next();
};
async function isAdmin(req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.SECRET);
        const admin = await AdminModel.buscarID(decoded.id);
 
        if(!admin) {
            return res.status(401).json({msg: "Não autorizado!" });
        }

        req.token = token;
        req.admin = admin;
        
        next();
    }
    catch(e) {
        res.status(401).json({ msg: "Realize a autenticação!" });
    }
};
async function isAuth(req, res, next) {
   
    try {
        const token = req.header('Authorization');

        if(!token) {
            return res.status(403).json({ msg: "Token não inserido!" });
        }
        
        const tokenComBearer = token.replace('Bearer ', '');

        if(!tokenComBearer) {
            return res.status(401).send({ msg:'O token não foi inserido corretamente'});
        }

        const decoded = jwt.verify(tokenComBearer, process.env.SECRET);

        const admin = await AdminModel.buscarID(decoded.id);
        const user = await UserModel.buscarID(decoded.id);

        req.token = token;
        req.admin = admin;
        req.user = user;

        next();

        if(!decoded) {
           return res.status(401).json({ msg: "Realize a autenticação!" }); 
        }
    } catch (e) {
        if(jwt.TokenExpiredError) {
           return res.status(498).json({ msg:"Token expirado! Realize o login novamente." });
        }
    }
}

module.exports = {
    isAuth,
    validaID,
    validaPost: validaPost,
    validaLogin: validaLogin,
    isAdmin: isAdmin,
};