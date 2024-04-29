const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uuibjb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotCollection = client.db('spotDB').collection('spot');
    const countryCollection = client.db('spotDB').collection('country');

    // ------------- Spot -------------

    app.get('/spot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query);
      res.send(result);
    })


    app.post('/spot', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    })


    app.put('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateSpot = req.body;

      const spot = {
        $set: {
          spotName: updateSpot.spotName,
          photo: updateSpot.photo,
          shortDescription: updateSpot.shortDescription,
          countryName: updateSpot.countryName,
          category: updateSpot.category,
          location: updateSpot.location,
          averageCost: updateSpot.averageCost,
          seasonality: updateSpot.seasonality,
          travelTime: updateSpot.travelTime,
          totalVisitorsPerYear: updateSpot.totalVisitorsPerYear
        }
      }

      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result);
    })


    app.delete('/spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })


    // ---------- Country ---------------
    app.get('/country', async (req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/country/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await countryCollection.findOne(query);
      res.send(result);
    })

    app.post('/country', async (req, res) => {
      // const newCountry = req.body;
      const country = req.body;
      console.log(country);
      const result = await countryCollection.insertOne(country);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Tourist spot server is running')
})

app.listen(port, () => {
  console.log(`Tourist Server is running on port: ${port}`)
})