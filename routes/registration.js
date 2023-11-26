const express = require('express')
const router = express.Router()

// functions import
const { registrationCollection, contestCollection } = require('../functions/databaseClient');
const { ObjectId } = require('mongodb');

router.post('/', async(req, res)=>{
    const data = req.body;
    console.log(data)
    const result = await registrationCollection.insertOne(data);
    res.send(result);
})

router.get('/particular-contests/:email', async(req, res)=>{
    const query = {userEmail: req.params.email};
    const registration = await registrationCollection.find(query).toArray();
    const allContest = await contestCollection.find({}).toArray();
    let data = [];
    registration.forEach((r)=>{
          allContest.forEach((a)=>{
            if(r.contestId === a._id.toString()) data.push({contest: a, submitted: r.submitted})
          })
    })
    res.send(data);
})

router.put('/', async(req, res)=>{
    const updatedData = req.body;
    delete updatedData._id;
    const query = {
        userEmail: req?.body?.userEmail,
        contestId: req?.body?.contestId
    }
    const updateDoc = {$set: updatedData}
    const data = await registrationCollection.updateOne(query, updateDoc, {upsert: true});
    res.send(data);
})

module.exports = router