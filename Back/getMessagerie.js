const connect_db = require('./connect_db')
const config_serv = require('./configServ')
const config = require('./configDB')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const path = require('path');

async function setPicture(req,res){
    const cookies = req.cookies
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            const token =  req.cookies.jwt
            console.log(token)
            const decoded = jwt.verify(token, config_serv.secretJWT);
            console.log(decoded)
            const email = decoded.email     
            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.evenements);
            
            const {tittle, messages } = req.body;
            console.log(tittle, messages);

            const findOneResult = await collection.findOneAndUpdate({'email': email},{$set: {'firstName': firstName,'lastName': lastName, 'description': description, 'activities': selectedInterests}});
            

            res.send("ok")
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }
  
}

module.exports = setPicture