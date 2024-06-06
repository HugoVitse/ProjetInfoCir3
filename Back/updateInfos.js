const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')

async function updateInfos(req,res){
    const cookies = req.cookies
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            const data = {
                email:req.body.email,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                dateOfBirth:req.body.dateOfBirth
            }
            const token =  req.cookies.jwt
            console.log(token)
            const decoded = jwt.verify(token, config_serv.secretJWT);
            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.users);
            const email = decoded.email

            
            if(email != req.body.email){
                const testmail = await collection.findOne({email:req.body.email})
                if(testmail != null){
                    res.status(505).send()
                    return
                }
            }     
 
            await collection.findOneAndUpdate({email:email},{$set:data})
            if(req.body.passwordChanged){
                await collection.findOneAndUpdate({email:email},{$set:{password:hash_password(req.body.password)}})
            }
            res.cookie('jwt',jwt.sign({ email: req.body.email }, config_serv.secretJWT), { expires: new Date(Date.now() + 864000000)});
            console.log(res)
            res.status(200).send("COnnexion réussie")
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }

}

module.exports = updateInfos