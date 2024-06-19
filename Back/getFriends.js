const { ObjectId } = require('mongodb');
const config = require('./configDB');

async function getFriends(req, res) {
  const client = req.app.locals.db;
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid user ID');
  }

  try {
    const usersCollection = client.db(config.dbName).collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const friends = await usersCollection.find({ _id: { $in: user.friends } }).toArray();
    res.status(200).json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

module.exports = getFriends;
