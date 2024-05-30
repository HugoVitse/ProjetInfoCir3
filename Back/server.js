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

<<<<<<< HEAD

=======
const fillQuestionnaire = require("./fillQuestionnaire")
>>>>>>> origin/front-mobile
const setFirstLogin = require('./setFirstLogin')
const activities = require('./activities')
const login = require('./login')
const register = require('./register')
const getInfos = require('./getInfos')






<<<<<<< HEAD
=======

>>>>>>> origin/front-mobile
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
<<<<<<< HEAD
    app.get('/firstlogin', setFirstLogin)
=======
    app.post('/fillquestionnaire',fillQuestionnaire)
>>>>>>> origin/front-mobile

 

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