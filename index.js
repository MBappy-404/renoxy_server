const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();




//middle wares
app.use(cors());
app.use(express.json())

//mongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@cluster0.wss65wz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// console.log(uri);

async function run(){

     try{
          const serviceCollection = client.db('homeService').collection('services');
          const reviewCollection =  client.db('homeService').collection('reviews');

          app.get('/services', async (req, res)=>{
               const query = {};
               const cursor = serviceCollection.find(query);
               const services = await cursor.limit(3).toArray();
               res.send(services)

          } )

          app.get('/allService', async(req, res)=>{
               const query = {};
               const cursor = serviceCollection.find(query);
               const services = await cursor.toArray();
               res.send(services)
          });

          app.get('/allService/:id', async(req,res)=>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)};
               const details = await serviceCollection.findOne(query);
               res.send(details);
               
          })

          //Reviews
          app.post('/reviews', (req, res)=>{
               const reviews = {name:Bappy, logo:'lskdoidosk'}
               const result = reviewCollection.insertOne(reviews);
          })


     }

     finally{

     }

}

run().catch(err => console.log(err))

app.get('/', (req, res)=>{
     res.send('home service running')
})

app.listen(port, ()=>{
     console.log(`home service server running on ${port}`);
})