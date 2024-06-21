const express = require('express')
const cookieParser = require('cookie-parser')
const https = require('https');
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const app = express()
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
var whitelist = ['https://localhost:3000',undefined /** other domains if any */ ]
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
const sendMessage = require('./sendMessage')
const verifyPassword = require("./verifyPassword")
const setDaily = require("./setDaily")
const scrapActivities = require('./scrapActivities')
const activities = require('./activities')
const evenements = require('./evenements')
const login = require('./login')
const register = require('./register')
const getInfos = require('./getInfos')
const updateInfos = require('./updateInfos')
const setPicture = require('./setPicture')
const createEvenement = require('./createEvenement')
const EventRegister = require('./EventRegister')
const getEvents = require('./getEvents')
const getMoodTracker = require('./getMoodTracker')
const getFriendList = require('./getFriendList')
const getAllUsers = require('./getAllUsers')
const friendRequests = require('./friendRequest')
const getMessage = require('./getMessage')
const updateInfoWeb = require('./updateInfoWeb')
const acceptFriendRequest = require('./acceptFriendRequest')
const ParticipantDelete = require('./ParticipantDelete')
const getColor = require('./getColor')
const EventDelete = require('./EventDelete')
const denyFriendRequest = require('./denyFriendRequest')
const deleteFriend = require('./deleteFriend')
const getFriendInfos = require('./getFriendInfos')



async function serv(){


  await connect_db.ConnectDB();

    
  

  app.use(express.static(path.join(__dirname, '../linx/build')));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../linx/build', 'index.html'));
  });

  app.post('/login', login)
  app.post('/register', register)
  app.get('/activities', activities)
  app.get('/infos', getInfos)
  app.get('/getMoodTracker', getMoodTracker)
  app.post('/fillquestionnaire',fillQuestionnaire)
  app.post('/FillMoodTracker',FillMoodTracker)
  app.post('/setDaily',setDaily)
  app.post('/verifyPassword',verifyPassword)
  app.post('/updateInfos',updateInfos)
  app.post('/setPicture',setPicture)
  app.post('/createEvenement',createEvenement)
  app.get('/evenements',evenements)
  app.post('/EventRegister',EventRegister)
  app.post('/getEvents',getEvents)
  app.get('/getMessage/:id',getMessage)
  app.post('/sendMessage',sendMessage)
  app.post('/getFriendList',getFriendList)
  app.get('/getAllUsers',getAllUsers)
  app.post('/friendRequests',friendRequests)
  app.post('/updateInfoWeb',updateInfoWeb)
  app.post('/acceptFriendRequest',acceptFriendRequest)
  app.post('/getColor',getColor)
  app.post('/ParticipantDelete',ParticipantDelete)
  app.post('/EventDelete',EventDelete)
  app.post('/denyFriendRequest',denyFriendRequest)
  app.post('/deleteFriend',deleteFriend)

  app.post('/getFriendInfos',getFriendInfos)


  console.log(path.join(__dirname, 'profile_pictures'))

  app.use('/profile_pictures',express.static(path.join(__dirname, 'profile_pictures')));

  // app.listen(80, () => {  
  //     console.log(`serever is runing at port ${port}`);
  // })
  https.createServer(
      {
          key: fs.readFileSync("ssl/private.key"),
          cert: fs.readFileSync("ssl/certificate.crt"),
          ca: fs.readFileSync("ssl/ca_bundle.crt")
      },
      app
  ).listen(port, () => {
      console.log(`serever is runing at port ${port}`);
  })
    
}

serv();
scrapActivities();
