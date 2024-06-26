const connect_db = require('./connect_db')
const config_serv = require('./configServ')
const config = require('./configDB')
const fs = require('fs')
const jwt = require('jsonwebtoken');
const path = require('path');

async function setPicture(req,res){
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
            const collection = database.collection(config.users);

            const picture = req.body.picture.substring(22,req.body.picture.length)
            console.log(picture)

       
        
            const outputFile = path.join(__dirname, `profile_pictures/${email}.${req.body.mime.split('/')[1]==undefined?'jpeg':req.body.mime.split('/')[1]}`);

            // Écrire les données de l'image dans le fichier
            fs.writeFile(outputFile, picture, 'base64', (err) => {
                if (err) {
                    throw err;
                }
                console.log(`Image sauvegardée sous : ${outputFile}`);
            });
            
        
  
            const findOneResult = await collection.findOneAndUpdate({'email': email},{$set:{image:`profile_pictures/${email}.${req.body.mime.split('/')[1]}`}});
            
        
            


            res.send("ok")
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }
  
}

module.exports = setPicture