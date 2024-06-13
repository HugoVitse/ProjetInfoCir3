const config_serv = require('./configServ')
const config = require('./configDB')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const connect_db = require('./connect_db')
const { ObjectId } = require('mongodb');


async function sendMessage(req,res){

   
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
            const collection = database.collection(config.evenements);
        
        
            const id = req.body.id
            const message = req.body.message
            var oid = new ObjectId(id)

            const findOneResult = await collection.findOne({_id:oid})

            if(findOneResult == null || findOneResult.chat == null){
                res.status(508).send()
                return
            }
            else{
                const updateResult = await collection.findOneAndUpdate({_id:oid},{$push:{chat:{author:decoded.email,message:message}}})
                res.send("ok")
                return
            }

         
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }


}

module.exports = sendMessage;