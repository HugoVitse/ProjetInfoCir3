const config = require('./configDB')
const hash_password = require('./hash_password')
const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const connect_db = require('./connect_db')
const ColorThief = require('colorthief');
const fs= require('fs')

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(rgb) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}
async function getColor(req,res){
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
        
        
            const findOneResult = await collection.findOne({'email':  bol?email:emailBody});

            ColorThief.getColor(findOneResult.image)
                .then(color => { console.log(color);res.send(rgbToHex(color));return;console.log(color) })
                .catch(err => { console.log(err);res.send("black") })


        
           

           
          
            
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }

}

module.exports = getColor

