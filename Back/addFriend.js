const connect_db = require('./connect_db');
const config_serv = require('./configServ');
const config = require('./configDB');
const jwt = require('jsonwebtoken');

async function addFriend(req, res) {
  const cookies = req.cookies;
  if (!('jwt' in cookies)) {
    res.status(500).send('JWT non trouvé dans les cookies.');
    return;
  }

  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, config_serv.secretJWT);
    const userEmail = decoded.email;
    const friendEmail = req.body.email;

    const database = connect_db.client.db(config.dbName);
    const usersCollection = database.collection(config.users);

    // Vérifier si l'ami existe déjà dans la liste friends
    const user = await usersCollection.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send('Utilisateur non trouvé.');
      return;
    }

    const { friends } = user;
    if (friends.includes(friendEmail)) {
      res.status(400).send('Cet ami est déjà ajouté.');
      return;
    }

    // Ajouter l'ami à la liste friends
    const result = await usersCollection.findOneAndUpdate(
      { email: userEmail },
      { $push: { friends: friendEmail } }
    );

    res.send('Ami ajouté avec succès.');
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'ami :', err);
    res.status(502).send('Erreur lors de l\'ajout de l\'ami : erreur serveur.');
  }
}

module.exports = addFriend;
