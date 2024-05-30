const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function login(req,res){
    const { email , password } = req.body;
    const hashedpassword = hash_password(password);
    const user = {
        "email":email,
        "password":hashedpassword
    }

    console.log(user)

    const database = connect_db.client.db(config.dbName);
    const collection = database.collection(config.users);


    const findOneQuery = { email: user.email };
    const findOneResult = await collection.findOne(findOneQuery);

    if(findOneResult === null){
        res.status(506).send("Nom d'utilisateur ou mot de passe invalide");
        return
    }

    else{
        if( hashedpassword === findOneResult.password) {
            // const token = `jwt=${jwt.sign({ email: user.email }, config_serv.secretJWT)}; HttpOnly`;
            // res.set("Set-Cookie",token)
            res.cookie('jwt',jwt.sign({ email: user.email }, config_serv.secretJWT), { expires: new Date(Date.now() + 864000000)});
            res.status(200).send("COnnexion réussie")
        }
        else{
            res.status(506).send("Nom d'utilisateur ou mot de passe invalide");
        }
        return
    }

}

module.exports = login