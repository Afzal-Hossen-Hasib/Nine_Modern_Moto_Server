const express = require('express')
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT||5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sowhm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function  run() {
    try {
        await client.connect();

        const partsCollection = client.db('modern_moto').collection('parts');
        const myOrderCollection = client.db('modern_moto').collection('myOrder');
        const reviewCollection = client.db('modern_moto').collection('review');
        const userCollection = client.db('modern_moto').collection('users');


        app.get('/part', async (req, res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            res.send(parts);
        });

        app.put ('user/:email', async(req, res) => {
          const email = req.params.email;
          const user = req.body;
          const filter = {email: email};
          const options = { upsert: true };
          const updateDoc = {
            $set: user,
          };
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send (result);
        });

        app.get('/part/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const part = await partsCollection.findOne(query);
          res.send(part);
      })

      app.post ('/myorder', async (req, res) => {
        const myItems = req.body;
        const result = await myOrderCollection.insertOne(myItems);
        res.send (result);
      });

      app.get('/myorder', async (req, res) => {
        const email = req.query.email;
        const query = { email: email }
        const cursor = myOrderCollection.find(query);
        const items = await cursor.toArray();
        res.send(items)
    });

      app.get ('/myorder/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const productInfo = await myOrderCollection.findOne(query);
        res.send (productInfo);
      });

      app.delete('/myorder/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await myOrderCollection.deleteOne(query);
        res.send(result);
    })

    app.get('/review', async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const review = await cursor.toArray();
      res.send (review);
    })

    app.post('/review', async (req, res) => {
      const allReview = req.body;
      const result = await reviewCollection.insertOne(allReview);
      res.send (result);
    })


    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})