const connect_db = require('./connect_db')
const config_serv = require('./configServ')
const config = require('./configDB')
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId

async function EventRegister(req,res){
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

            const id_event = req.body.id
            console.log(email)
            const new_id = new ObjectId(`${id_event}`)
            const findOneResult = await collection.findOne({_id:new_id})

            console.log(findOneResult)
            if(findOneResult.participants.length >= parseInt(findOneResult.nbinvites)+1){
                res.status(503).send()
                return
            }

            if(findOneResult.participants.indexOf(email) != -1){
                res.status(504).send()
                return
            }
        
            const updateResult = await collection.findOneAndUpdate({_id:new_id},{$push:{participants:email}});

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

module.exports = EventRegister