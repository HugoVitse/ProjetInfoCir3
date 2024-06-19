const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function getFriendList(req,res){
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
        
            const bol = req.body.bol
            const emailBody = req.body.email

            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.users);

       
        
        
            const findOneResult = await collection.findOne({'email': bol?email:emailBody});

            if('friends' in findOneResult){

                const friends = findOneResult.friends
                const friendList = []

                for (let i = 0; i < friends.length; i++){
                    const friend = await collection.findOne({'email': friends[i]})
                    friendList.push({
                        email: friend.email,
                        firstName: friend.firstName,
                        lastName: friend.lastName,
                        activities: friend.activities
                    })
                }
                res.send(friendList)
                return
            }
            else{
                res.send([])
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

module.exports = getFriendList