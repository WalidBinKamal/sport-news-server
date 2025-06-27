const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000

const app = express();
//middleware setup
app.use(cors());
app.use(express.json());



const userName = process.env.DB_USER
const password = process.env.DB_PASS

const uri = `mongodb+srv://${userName}:${password}@cluster0.7rlpdj6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const newsCollection = client.db("newsDB").collection("news");

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get('/', (req, res) => {
            res.send('Sports news server is running');
        })

        //News mongodb

        app.get('/news', async (req, res) => {
            const cursor = newsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get(`/news/:id`, async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await newsCollection.findOne(query)
            res.send(result)
        })

        app.post('/news', async (req, res) => {
            const news = req.body
            const result = await newsCollection.insertOne(news)
            res.send(result)
        })

        app.delete(`/news/:id`, async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await newsCollection.deleteOne(query)
            res.send(result)
        })

        




    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Sports News Server is running on port: ${port}`)
})