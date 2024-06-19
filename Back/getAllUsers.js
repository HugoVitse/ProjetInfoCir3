const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db');

async function getAllUsers(req,res){
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
        
            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.users);

            const projection = {
                firstName: 1,
                lastName: 1,
                email: 1,
                friends:1,
                friendRequests:1
              };
            const findOneResult = await collection.find({}, {projection}).toArray();

            res.send(findOneResult)
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }

}

module.exports = getAllUsers