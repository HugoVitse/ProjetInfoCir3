const config_serv = require('./configServ')
const config = require('./configDB')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const connect_db = require('./connect_db')

const getHtml = (url) => {
    return new Promise((resolve, reject) => {
        $.get(url, (html) => {
            resolve(html);
        }).fail((err) => {
            reject(err);
        });
    });
};

async function activities(req,res){
    const events = []; 
    const initialHtml = await getHtml("https://www.lille.fr/Evenements/");
    const nbpagelist = $(initialHtml).find(".page");
    const nbpageactually = nbpagelist[nbpagelist.length - 1];
    const nbpage = parseInt($(nbpageactually).text());
    for(let i=1; i<nbpage;i++){
        const initialHtml = await getHtml(`https://www.lille.fr/Evenements/(offset)/${i*10}`);
        const listeevent = $(initialHtml).find(".evenement");
        listeevent.each((i, event) => { 
            // scrape data from the product HTML element 
            const eventAdd = { 
                name: $(event).find(".right > span").text(), 
            }; 
     
            events.push(eventAdd); 
        }); 
    }
    console.log(events)

   
    const cookies = req.cookies
    console.log(cookies)
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            const token =  req.cookies.jwt
            const decoded = jwt.verify(token, config_serv.secretJWT);
            console.log(decoded)

            const database = connect_db.client.db(config.dbName);
            const collection = database.collection(config.activities);
        
        
            const findOneResult = await collection.find({}).toArray();
            // Await the response from the GET request

            res.status(200).send(findOneResult)
        }
        catch(err){
            console.log(err)
            res.status(502).send()
            return
        }
    }


}

module.exports = activities;
