const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function acceptFriendRequest(req,res){
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
        
        
            const findOneResult = await collection.findOne({'email': email});
            const findOneResultFr = await collection.findOne({'email': emailFriend});

            if('friends' in findOneResult){

                const findOneUpdateResult = await collection.findOneAndUpdate({'email':email},{$push:{friends:emailFriend}})
            }
            else{
                const findOneUpdateResult = await collection.findOneAndUpdate({'email':email},{$set:{friends:[emailFriend]}})
       
            }
            const findOneUpdateResultFL = await collection.findOneAndUpdate({'email':email},{$pull:{friendRequests:emailFriend}})
            if('friends' in findOneResultFr){

                const findOneUpdateResult = await collection.findOneAndUpdate({'email':emailFriend},{$push:{friends:email}})
            }
            else{
                const findOneUpdateResult = await collection.findOneAndUpdate({'email':emailFriend},{$set:{friends:[email]}})
       
            }
            res.send()

        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }

}

module.exports = acceptFriendRequest