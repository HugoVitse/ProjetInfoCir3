const config_serv = require('./configServ')
const jwt = require('jsonwebtoken');
const axios = require("axios")
const { JSDOM } = require( "jsdom" ); 
const { window } = new JSDOM("", { 
	url: "https://www.lille.fr/", 
}); 
const $ = require( "jquery" )( window ); 

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
    if(!('jwt' in cookies)){
        res.status(500).send()
        return
    }
    else{
        try{
            const token =  req.cookies.jwt
            const decoded = jwt.verify(token, config_serv.secretJWT);
            console.log(decoded)

            const url = 'https://www.lilletourism.com/api/render/website_v2/lille-tourisme/playlist/48080/fr_FR/json?page=17&randomSeed=5e0ec7ac-791f-4329-946f-42f86c093f5a&confId=48080';
    
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
