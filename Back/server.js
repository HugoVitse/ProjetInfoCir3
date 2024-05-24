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





async function serv(){




    await connect_db.ConnectDB();


    app.post('/login', login)

    app.post('/register',register);

    app.post('/activities',activities);

    https.createServer(
        {
            key: fs.readFileSync("ssl/key.pem"),
            cert: fs.readFileSync("ssl/cert.pem"),
        },
        app
    ).listen(port, () => {
        console.log(`serever is runing at port ${port}`);
    })
    
}

serv();