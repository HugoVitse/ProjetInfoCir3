const express = require('express')
const https = require('https');
const fs = require('fs')
const app = express()
const port = 443

app.get('/', (req, res) => {
  res.send('Hello World!')
})


https.createServer(
    {
        key: fs.readFileSync("ssl/key.pem"),
        cert: fs.readFileSync("ssl/cert.pem"),
    },
    app
).listen(port, () => {
    console.log(`serever is runing at port ${port}`);
})

