const connect_db = require('./connect_db');
const config_serv = require('./configServ');
const config = require('./configDB');
const jwt = require('jsonwebtoken');

async function FillMoodTracker(req, res) {
  const cookies = req.cookies;
  if (!('jwt' in cookies)) {
    res.status(500).send();
    return;
  } else {
    try {
      const token = req.cookies.jwt;
      console.log(token);
      const decoded = jwt.verify(token, config_serv.secretJWT);
      console.log(decoded);
      const email = decoded.email;
      const database = connect_db.client.db(config.dbName);
      const collection = database.collection(config.moodTracker);

      const questionnaire = req.body;
      console.log(questionnaire);

      const findOne = await collection.findOne({ 'email': email });

      if(findOne == null) {
        const insertOne = await collection.insertOne({
          'email': email,
          'moodTrackerData': [questionnaire]
        })
      }

      else{
        const findOneResult = await collection.findOneAndUpdate(
          { 'email': email },
          { $push: { moodTrackerData: questionnaire } }
        );
      }

  
      res.send("ok");
    } catch (err) {
      console.log(err);
      res.status(502).send();
      return;
    }
  }
}

module.exports = FillMoodTracker;