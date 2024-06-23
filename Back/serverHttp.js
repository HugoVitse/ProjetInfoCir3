const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());

const port = 80



async function serv(){


    
  


  app.use('*', function (req, res) {
    res.location('https://linx.cloudns.be/')
    res.status(301).send()
  });



  app.listen(80, () => {  
      console.log(`serever is runing at port ${port}`);
  })

    
}

serv();