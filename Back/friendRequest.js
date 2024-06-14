const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function friendRequests(req,res){
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
        
            const searchMail = req.body.email
        
            const findOneResult = await collection.findOne({'email': email});

            if('friendRequests' in findOneResult){

                if(findOneResult.friendRequests.includes(searchMail)){
                    res.send()
                    return
                }

                const findOneResult = await collection.findOneAndUpdate({'email': searchMail},{$push:{friendRequests:email}});
                res.send()
                return
            }
            else{
                const findOneResult = await collection.findOneAndUpdate({'email': searchMail},{$set:{friendRequests:[email]}});
                res.send()
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

module.exports = friendRequests