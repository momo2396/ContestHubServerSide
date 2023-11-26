const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

const { client, connectDB } = require('./functions/databaseClient')
const contestRoute = require('./routes/contests')
const userRoute = require('./routes/users');
const bannerImageRoute = require('./routes/bannerImage')
const registeredContest = require('./routes/registration')
app.use(cors());
app.use(express.json());


async function run() {
  try {
    
    app.get('/', (req, res)=>{
        res.send('Server is Running...');
    })
    app.use('/all-contests', contestRoute)
    app.use('/all-users', userRoute)
    app.use('/banner-images',bannerImageRoute)
    app.use('/register-contest', registeredContest)

  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, async()=>{
    await client.connect();
    // await connectDB();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    console.log(`Server is running on port ${port}`);
})
