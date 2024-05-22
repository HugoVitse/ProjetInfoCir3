const hash_password = require('./hash_password')
const add_user = require('./add_user')
const filter_user_entry = require('./filter_user_entry');
const connect_db = require('./connect_db')

async function register(req,res){
    const { username , password } = req.body;

    const verificationUser= filter_user_entry(username)
    const verificationPass = filter_user_entry(password)

    if(verificationUser || verificationPass){
        res.status(504).send("Caractères invalides dans le nom d'utilisateur ou le mot de passe")
        return
    }

    const hashedpassword = hash_password(password)

    const user = {
        "username":username,
        "password":hashedpassword
    }

    const isExist = await add_user(connect_db.client,user);

    if(isExist){
        res.status(505).send("Nom d'utilisateur déjà pris");
        return
    }

    else{
        res.status(200).send("Utilisateur créé avec succès");
        return
    }
}

module.exports = register