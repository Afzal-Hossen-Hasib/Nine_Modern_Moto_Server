const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT||5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://modern_admin:<password>@cluster0.sowhm.mongodb.net/?retryWrites=true&w=majority";

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})