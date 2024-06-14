const config_serv = require('./configServ')
const config = require('./configDB')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const connect_db = require('./connect_db')
const { ObjectId } = require('mongodb');


async function getInfosEmail(req,res){

    const cookies = req.cookies
    console.log(cookies)
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            const token =  req.cookies.jwt
            const decoded = jwt.verify(token, config_serv.secretJWT);

            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.users);
        
            const email = req.params.email;

            const findOneResult = await collection.findOne({'email': email});

            res.send(findOneResult)
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }
}

module.exports = getInfosEmail;