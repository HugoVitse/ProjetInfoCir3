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
            const {lastName, firstName, selectedInterests, description } = req.body;
            console.log(lastName, firstName, selectedInterests, description)

            if(req.body.picture.length>0){
                const picture = req.body.picture.substring(22,req.body.picture.length);
                console.log(picture);
                const outputFile = path.join(__dirname, `profile_pictures/${email}.png`);
                 // Écrire les données de l'image dans le fichier
                fs.writeFile(outputFile, picture, 'base64', (err) => {
                    if (err) {
                        throw err;
                    }
                    console.log(`Image sauvegardée sous : ${outputFile}`);
                });
                const findOneResult = await collection.findOneAndUpdate({'email': email},{$set: {'firstName': firstName,'lastName': lastName, 'description': description, 'activities': selectedInterests,image:`profile_pictures/${email}.png`}});
            }
            else{const findOneResult = await collection.findOneAndUpdate({'email': email},{$set: {'firstName': firstName,'lastName': lastName, 'description': description, 'activities': selectedInterests}});}
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