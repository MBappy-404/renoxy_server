const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
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

function verifyJWT(req, res, next) {
     const authHeader = req.headers.authorization;
     if (!authHeader) {
          return res.status(401).send({ message: 'unauthorized access' });
     }
     const token = authHeader.split(' ')[1];

     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
          if (err) {
               return res.status(403).send({ message: 'Forbidden access' });
          }
          req.decoded = decoded;
          next();
     })
}

async function run() {

     try {
          const serviceCollection = client.db('homeService').collection('services');
          const reviewCollection = client.db('homeService').collection('reviews');

          app.post('/jwt', (req, res) => {
               const user = req.body;
               const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
               res.send({ token });
               // console.log(token);

          })
          app.get('/services', async (req, res) => {
               const query = {};
               const cursor = serviceCollection.find(query);
               const services = await cursor.limit(3).toArray();
               res.send(services)

          })

          app.get('/allService', async (req, res) => {
               const query = {};
               const cursor = serviceCollection.find(query);
               const services = await cursor.toArray();
               res.send(services)
          });

          app.get('/allService/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const details = await serviceCollection.findOne(query);
               res.send(details);

          })


          app.post('/allService', async (req, res) => {
               const service = req.body;
               const result = await serviceCollection.insertOne(service)
               res.send(result)
          })

          // review api 
          app.post('/reviews', async (req, res) => {
               const review = req.body;
               const result = await reviewCollection.insertOne(review);
               res.send(result)
          })

          app.get('/reviews', verifyJWT, async (req, res) => {

               // console.log(req.headers.authorization)
               const decoded = req.decoded;
               // console.log(decoded);
               if(decoded.email !== req.query.email){
                    res.status(403).send({message: Unauthorize})

               }

               let query = {};
               if (req.query.email) {
                    query = {
                         email: req.query.email
                    }
               }
               const cursor = reviewCollection.find(query);
               const review = await cursor.toArray();
               res.send(review)
          })

          app.get('/reviews/service', async (req, res) => {
               let query = {};
               if (req.query.serviceID) {
                    query = {
                         serviceId: req.query.serviceID,
                    };
               }
               const reviews = await reviewCollection.find(query).toArray();
               const result = reviews.sort().reverse();
               res.send(result)
          })

          app.delete('/reviews/:id', async(req, res)=>{
               const id = req.params.id;
               const query = {_id: ObjectId(id)};
               const result = await reviewCollection.deleteOne(query);
               res.send(result);
          })

          app.put('/reviews/:id', async(req, res)=>{
               const id = req.params.id;
               const filter = {_id: ObjectId(id)};
               const review = req.body;
               // console.log(updateReview);
               const option = {upsert: true};
               const updateReview = {
                    $set:{
                         rating: review.rating,
                         message: review.message
                    }
               }
               const result = await reviewCollection.updateOne(filter,updateReview, option )

               res.send(result);
          })


     }

     finally {

     }

}

run().catch(err => console.log(err))

app.get('/', (req, res) => {
     res.send('home service running')
})

app.listen(port, () => {
     console.log(`home service server running on ${port}`);
})