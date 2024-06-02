const fs = require('fs');
const connect_db = require('./connect_db')
const config_serv = require('./configServ')
const config = require('./configDB')
const { JSDOM } = require( "jsdom" ); 
const { window } = new JSDOM("", { 
	url: "https://www.lille.fr/", 
}); 
const $ = require( "jquery" )( window ); 


const interval = 60*60*1000

const getHtml = (url) => {
    return new Promise((resolve, reject) => {
        $.get(url, (html) => {
            resolve(html);
        }).fail((err) => {
            reject(err);
        });
    });
};

async function scrapActivitiesWrap(){
    console.log("Scraping en cours...")
    const events = []; 
    const initialHtml = await getHtml("https://www.lille.fr/Evenements/");
    const nbpagelist = $(initialHtml).find(".page");
    const nbpageactually = nbpagelist[nbpagelist.length - 1];
    const nbpage = parseInt($(nbpageactually).text());
    const listeevent = $(initialHtml).find(".evenement");
    listeevent.each((i, event) => { 
        const link = $(event).find(".right > span > a").attr("href")
        const lengthFin = ( (link.charCodeAt(link.length-1) <= 57) && (link.charCodeAt(link.length-1)  >= 48) ) ?link.length-1:link.length
        const predate = $(event).find(".dateInfo p:not(.subtitle)").text()
        var article = predate.indexOf("Le")
        if(article == -1){
            article = predate.indexOf("Du")
        }
        if(article==-1){
            article = predate.indexOf("Jusqu")
        }
        // scrape data from the product HTML element 
        const eventAdd = { 
            image : `https://www.lille.fr${$(event).find(".image-large > img").attr("src")}`,
            name: link.substring(link.indexOf("Evenement")+11,lengthFin).replace(/-/g," "),
            type: $(event).find(".right > .event-type").text(),
            description :  $(event).find(".right > .innerContent").text().replace(/\n/g,""),
            date:predate.substring(article,predate.indexOf("\n",predate.indexOf("\n")+1)), 
            adresse:$(event).find(".contactInfo p").text(),
        }; 
    
        events.push(eventAdd); 
    }); 
    for(let i=1; i<nbpage;i++){
        const initialHtml = await getHtml(`https://www.lille.fr/Evenements/(offset)/${i*10}`);
        const listeevent = $(initialHtml).find(".evenement");
        listeevent.each((i, event) => { 
            const link = $(event).find(".right > span > a").attr("href")
            const lengthFin = ( (link.charCodeAt(link.length-1) <= 57) && (link.charCodeAt(link.length-1)  >= 48) ) ?link.length-1:link.length
            const predate = $(event).find(".dateInfo p:not(.subtitle)").text()
            var article = predate.indexOf("Le")
            if(article == -1){
                article = predate.indexOf("Du")
            }
            if(article==-1){
                article = predate.indexOf("Jusqu")
            }
            // scrape data from the product HTML element 
            const eventAdd = { 
                image : `https://www.lille.fr${$(event).find(".image-large > img").attr("src")}`,
                name: link.substring(link.indexOf("Evenement")+11,lengthFin).replace(/-/g," "),
                type: $(event).find(".right > .event-type").text(),
                description :  $(event).find(".right > .innerContent").text().replace(/\n/g,""),
                date:predate.substring(article,predate.indexOf("\n",predate.indexOf("\n")+1)), 
                adresse:$(event).find(".contactInfo p").text(),
            }; 
     
            events.push(eventAdd); 
        }); 
    }


    const filePath = 'events.json';


    const jsonString = JSON.stringify(events, null, 2);


    const database = connect_db.client.db(config.dbName);
    const collection = database.collection(config.activities);

    await collection.deleteMany({});

    const result = await collection.insertMany(events);

    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error('Une erreur s\'est produite lors de l\'écriture du fichier JSON:', err);
        } else {
            //console.log('Fichier JSON écrit avec succès');
        }
    });

    console.log("Scraping finie.")



}

const scrapActivities = () =>  {
    setInterval(scrapActivitiesWrap,interval)
}

module.exports = scrapActivities;

