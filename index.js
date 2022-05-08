const express = require("express");
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { ObjectID } = require("bson");
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vsayb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const bikeCollection = client.db('inventory').collection('bike')

        app.get('/inventory', async (req, res) => {
            const query = {}
            const cursor = bikeCollection.find(query)
            const bikes = await cursor.toArray()
            res.send(bikes)
        })
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.findOne(query)
            res.send(result)
        })
        app.put('/inventory/update/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bikeCollection.updateOne(query, {
                $set: { quantity: parseInt(req.body.quantity) }
            })
            res.send(result)
        })
        //my items
        app.get('/myitems', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = bikeCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })
        app.post('/inventory', async (req, res) => {
            const newItem = req.body
            const result = await bikeCollection.insertOne(newItem)
            res.send(result)
        })
        // delete inventory
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectID(id) }
            const result = await bikeCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('woking on warehouse')
})
app.listen(port, () => {
    console.log('warehouse server runing', port)
})