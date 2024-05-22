const config = require('./configDB')

async function add_user(client,user){

    const database = client.db(config.dbName);
    const collection = database.collection(config.users);

    const findOneQuery = { username: user.username };
    const findOneResult = await collection.findOne(findOneQuery);

    if(findOneResult === null){
        try {
            const insertOneResult = await collection.insertOne(user)
            console.log(`${insertOneResult.insertedCount} documents successfully inserted.\n`);
            return false;
        } catch (err) {
            console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
        }
    }

    else {
        console.log("Utilisateur déjà existant")
        return true;
    }  
    
}

module.exports = add_user;