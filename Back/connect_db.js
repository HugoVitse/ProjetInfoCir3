const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin: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@atlascluster.p3eh6po.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function ConnectDB() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch(error){
        console.log(error)
    }
}


module.exports = {
    ConnectDB:ConnectDB,
    client:client
}