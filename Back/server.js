const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connect_db = require('./connect_db');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

var whitelist = ['http://localhost:3000', undefined /** other domains if any */];
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

const port = 443;

const fillQuestionnaire = require("./fillQuestionnaire");
const FillMoodTracker = require("./FillMoodTracker");
const verifyPassword = require("./verifyPassword");
const setDaily = require("./setDaily");
const scrapActivities = require('./scrapActivities');
const activities = require('./activities');
const evenements = require('./evenements');
const login = require('./login');
const register = require('./register');
const getInfos = require('./getInfos');
const updateInfos = require('./updateInfos');
const setPicture = require('./setPicture');
const createEvenement = require('./createEvenement');
const EventRegister = require('./EventRegister');
const getEvents = require('./getEvents');
const getMoodTracker = require('./getMoodTracker');
const setMessagerie = require('./setMessagerie');
const getMessage = require('./getMessage');
const getAllUsers = require('./getAllUsers');
const addFriend = require('./addFriend');

async function serv() {
  await connect_db.ConnectDB();

  app.get("/", (req, res) => {
    console.log("ok");
    res.send("ta gueule");
  });

  app.get("/test", (req, res) => {
    res.cookie("test", "hein");
    res.send("ok");
  });

  app.post('/login', login);
  app.post('/register', register);
  app.get('/activities', activities);
  app.get('/infos', getInfos);
  app.get('/getMoodTracker', getMoodTracker);
  app.post('/fillquestionnaire', fillQuestionnaire);
  app.post('/FillMoodTracker', FillMoodTracker);
  app.post('/setDaily', setDaily);
  app.post('/verifyPassword', verifyPassword);
  app.post('/updateInfos', updateInfos);
  app.post('/setPicture', setPicture);
  app.post('/createEvenement', createEvenement);
  app.get('/evenements', evenements);
  app.post('/EventRegister', EventRegister);
  app.get('/getEvents', getEvents);
  app.post('/setMessagerie', setMessagerie);
  app.get('/getMessage/:id', getMessage);
  app.get('/getAllUsers', getAllUsers);
  app.post('/addFriend', addFriend);

  console.log(path.join(__dirname, 'profile_pictures'));

  app.use('/profile_pictures', express.static(path.join(__dirname, 'profile_pictures')));

  app.listen(80, () => {
    console.log(`server is running at port 80`);
  });

  // https.createServer(
  //     {
  //         key: fs.readFileSync("ssl/key.pem"),
  //         cert: fs.readFileSync("ssl/cert.pem"),
  //     },
  //     app
  // ).listen(port, () => {
  //     console.log(`server is running at port ${port}`);
  // });
}

serv();
scrapActivities();
