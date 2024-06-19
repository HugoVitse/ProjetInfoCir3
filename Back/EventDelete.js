const connect_db = require('./connect_db')
const config_serv = require('./configServ')
const config = require('./configDB')
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId

async function EventDelete(req,res){
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
            const collection = database.collection(config   .evenements);

            const id_event = req.body.id
            console.log(email)
            const new_id = new ObjectId(`${id_event}`)

            const updateResult = await collection.findOneAndDelete({_id:new_id});

            console.log(updateResult)

            res.send("ok")
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }

}

module.exports = EventDelete