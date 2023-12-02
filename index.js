const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY)
const { client, connectDB } = require('./functions/databaseClient')
const contestRoute = require('./routes/contests')
const userRoute = require('./routes/users');
const bannerImageRoute = require('./routes/bannerImage')
const registeredContest = require('./routes/registration')
const paymentRoute = require('./routes/payment')
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
    app.use('/create-payment-intent', paymentRoute)
    // app.post('/create-payment-intent', async(req, res)=>{
    //   const {price} = req.body;
    //   const amount = parseInt(price)*100;
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     amount: amount,
    //     currency: 'usd',
    //     payment_method_types: [
    //      'card'
    //     ]
    //   });
    //   console.log(paymentIntent)
    //   res.send({
    //     clientSecret: paymentIntent.client_secret
    //   })
    // })

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
