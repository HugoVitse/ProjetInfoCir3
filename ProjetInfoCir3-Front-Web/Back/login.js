const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function login(req,res){
    const { username , password } = req.body;
    const hashedpassword = hash_password(password);
    const user = {
        "username":username,
        "password":hashedpassword
    }

    console.log(user)

    const database = connect_db.client.db(config.dbName);
    const collection = database.collection(config.users);


    const findOneQuery = { username: user.username };
    const findOneResult = await collection.findOne(findOneQuery);

    if(findOneResult === null){
        res.status(506).send("Nom d'utilisateur ou mot de passe invalide");
        return
    }

    else{
        if( hashedpassword === findOneResult.password) {
            const token = `jwt=${jwt.sign({ username: user.username }, config_serv.secretJWT)}`;
            res.set("Set-Cookie",token)
            res.status(200).send("COnnexion réussie")
        }
        else{
            res.status(506).send("Nom d'utilisateur ou mot de passe invalide");
        }
        return
    }

}

module.exports = login