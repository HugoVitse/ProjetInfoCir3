const express = require('express')
const cookieParser = require('cookie-parser')
const https = require('https');
const fs = require('fs')
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cookieParser());
var whitelist = ['http://localhost:3000',undefined /** other domains if any */ ]
var corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
const connect_db = require('./connect_db');

const port = 443

const fillQuestionnaire = require("./fillQuestionnaire")
const FillMoodTracker = require("./FillMoodTracker")
const setDaily = require("./setDaily")
const scrapActivities = require('./scrapActivities')
const activities = require('./activities')
const login = require('./login')
const register = require('./register')
const getInfos = require('./getInfos')
const setPicture = require("./setPicture")







async function serv(){    

  await connect_db.ConnectDB();

  app.get("/",(req,res)=>{
      console.log("ok")
      res.send("ta gueule")
  })

  app.get("/test", (req,res)=>{
      res.cookie("test","hein")
      res.send("ok")
  })
  app.post('/login', login)
  app.post('/register', register)
  app.get('/activities', activities)
  app.get('/infos', getInfos)
  app.post('/fillquestionnaire',fillQuestionnaire)
  app.post('/FillMoodTracker',FillMoodTracker)
  app.post('/setDaily',setDaily)
  app.post('/setPicture',setPicture)



  app.listen(80,()=>{
      console.log(`serever is runing at port 80`);
  })

  // https.createServer(
  //     {
  //         key: fs.readFileSync("ssl/key.pem"),
  //         cert: fs.readFileSync("ssl/cert.pem"),
  //     },
  //     app
  // ).listen(port, () => {
  //     console.log(`serever is runing at port ${port}`);
  // })
    
}

serv();
scrapActivities();