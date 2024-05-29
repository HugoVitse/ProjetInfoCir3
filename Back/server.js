const express = require('express')
const cookieParser = require('cookie-parser')
const https = require('https');
const fs = require('fs')
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors())
const connect_db = require('./connect_db');

const port = 443


const activities = require('./activities')
const login = require('./login')
const register = require('./register')
const getInfos = require('./getInfos')





async function serv(){




    await connect_db.ConnectDB();

    app.get("/",(req,res)=>{
        console.log("ok")
        res.send("ta gueule")
    })

    app.post('/login', login)
    app.post('/register', register)
    app.post('/activities', activities)
    app.get('/infos', getInfos)

 

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