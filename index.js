const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
          const serviceCollection = client.db('')

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