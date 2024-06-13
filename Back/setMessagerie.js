const connect_db = require('./connect_db')
const config_serv = require('./configServ')
const config = require('./configDB')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const path = require('path');
const { ObjectId } = require('mongodb');

async function setMessagerie(req,res){
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
            const {id, messages } = req.body;
            console.log(id, messages);
            const objectId = new ObjectId(id);

            const findOneResult = await collection.findOneAndUpdate({_id: objectId },{$set: {messages : messages}});

            res.send("ok")
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }
  
}

module.exports = setMessagerie;
