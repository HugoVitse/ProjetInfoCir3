const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const axios = require("axios")


async function activities(req,res){

    const cookies = req.cookies
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            const token =  req.cookies.jwt
            const decoded = jwt.verify(token, config_serv.secretJWT);
            console.log(decoded)

            const url = 'https://events.statsigapi.net/v1/log_event_beacon?k=client-eQuZOzz7D7TWsrZtXEXGjLrsvFEvt7IJ3yQHf66gW3B'
    
            // Await the response from the GET request
            const response = await axios.get(url);
            console.log((response.data.items))

            res.status(200).send(response.data.items)
        }
        catch(err){
            res.status(502).send()
            return
        }
    }


}

module.exports = activities;