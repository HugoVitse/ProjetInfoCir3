const config_serv = require('./configServ')
const config = require('./configDB')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const connect_db = require('./connect_db')
const { ObjectId } = require('mongodb');

const Pusher = require("pusher");


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




            const pusher = new Pusher({
                appId: "1822838",
                key: "1a3a0863e71503fd5928",
                secret: "748a130828f3a391a488",
                cluster: "eu",
                useTLS: true
            });

          


            const findOneResult = await collection.findOne({_id:oid})

            if(findOneResult == null){
                res.status(508).send()
                return
            }
            else{
                if(findOneResult.chat == null){
                    const updateResult = await collection.findOneAndUpdate({_id:oid},{$set:{chat:[{author:decoded.email,message:message}]}}, { returnDocument: 'after' })
                    pusher.trigger(id, "my-event",updateResult.chat);

                }
                else{
                    const updateResult = await collection.findOneAndUpdate({_id:oid},{$push:{chat:{author:decoded.email,message:message}}}, { returnDocument: 'after' })
                    pusher.trigger(id, "my-event",updateResult.chat);

                }
                
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