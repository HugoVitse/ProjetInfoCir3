const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function deleteFriend(req,res){
    const cookies = req.cookies
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            

            const token =  req.cookies.jwt
            const decoded = jwt.verify(token, config_serv.secretJWT);
            const email = decoded.email  
            const emailFriend = req.body.email   
        
            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.users);
        
      

            const findOneUpdateResult = await collection.findOneAndUpdate({'email':email},{$pull:{friends:emailFriend}}, { returnDocument: 'after' })
            const findOneUpdateResult2 = await collection.findOneAndUpdate({'email':emailFriend},{$pull:{friends:email}})
            res.send(findOneUpdateResult.friends)
            return
        }

        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }

}

module.exports = deleteFriend