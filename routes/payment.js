const express = require('express')
const router = express.Router()



router.post('/', async(req, res)=>{
    const {price} = req.body;
    const amount = parseInt(price)*100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: [
       'card'
      ]
    });
    console.log(paymentIntent)
    res.send({
      clientSecret: paymentIntent.client_secret
    })
})

module.exports = router