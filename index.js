const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();




const app = express();
const port = process.env.PORT || 1000;

// cors
app.use(cors());
app.use(express.json());






// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster369.swbratv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();

    // Database
    const collegeCollection = client.db('collegeDB').collection('colleges');






    app.get('/colleges',  async (req, res) => {  
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    
    app.get('/collegeDetails/:id', async (req, res) => {
      const userId = req.query.userId;
      const id = req.params.id;
      const query = { _id: new ObjectId(id), userId: userId };
      const result = await collegeCollection.find(query).toArray();
      res.send(result[0]);
      
    });

    app.post('/colleges', async (req, res) => {
      const newToy = req.body;
      const result = await collegeCollection.insertOne(newToy);
      res.send(result);
    });

    app.put('/update/:id', async (req, res) => {
      const userId = req.query.userId;
      const id = req.params.id;
      const toy = req.body;

      const filter = { _id: new ObjectId(id), userId: userId };
      const updatedToy = {
        // $set: {
        //   price: toy.price,
        //   quantity: toy.quantity,
        //   description: toy.description,
        // },
      };

      const result = await collegeCollection.updateOne(filter, updatedToy);
      res.send(result);
    });

    app.delete('/colleges/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegeCollection.deleteOne(query);
      res.send(result);
    });



  


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running fine');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
