const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())



app.get('/',(req,res)=>{
    res.send('Users management server is running')
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9pshpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const myDB= client.db("data-management");
    const userCollection= myDB.collection("users")
    const equipmentCollection = myDB.collection("equipments")

    // Equipment server
    
    app.get('/equipments', async(req, res)=>{
      const result = await equipmentCollection.find().toArray();
      res.send(result);
    })

    app.get('/equipments/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
      const result = await equipmentCollection.findOne(query)
      res.send(result)
    })

    app.get('/myEquipments/:email', async(req, res)=>{
      const email = req.params.email;
      const query = { email : email}
      const result = await equipmentCollection.find(query).toArray();
      res.send(result)
    })

    app.post('/equipments', async(req,res)=>{
      const equipment = req.body;
      const result = await equipmentCollection.insertOne(equipment);
      res.send(result);
    })

    app.delete('/equipments/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id) }
      const result = await equipmentCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/equipments/:id', async(req, res)=>{
      const id = req.params.id;
      const updatedEquipment = req.body;
      const query = { _id : new ObjectId(id) }
      const updatedDocument={
        $set: updatedEquipment
      }
      const result = await equipmentCollection.updateOne(query, updatedDocument)
      res.send(result)
    })

    //Users server
    app.get('/users', async(req, res)=>{
        const result = await userCollection.find().toArray();
        res.send(result);
    })

    app.get('/users/:id', async(req,res)=>{
        const id= req.params.id;
        console.log(id);
        const query = {_id : new ObjectId(id)}
        const result = await userCollection.findOne(query)
        res.send(result)
    })

    app.post('/users', async(req,res)=>{
        const user= req.body;
        console.log('New user', user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.delete('/users/:id', async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const query= {_id : new ObjectId(id)}
        const result= await userCollection.deleteOne(query);
        res.send(result);
    })
    app.put('/users/:id', async(req,res)=>{
        const updatedData=req.body;
        const id=req.params.id;
        console.log(updatedData, id);
        const query = {_id : new ObjectId(id)};
        const updatedDocument={
            $set:updatedData
        }
        const result = await userCollection.updateOne(query, updatedDocument);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})