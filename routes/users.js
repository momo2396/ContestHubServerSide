const express = require('express')
const router = express.Router()

// functions import
const { userCollection } = require('../functions/databaseClient');
const { ObjectId } = require('mongodb');

router.post('/', async(req, res)=>{
    const data = req.body;
    const result = await userCollection.insertOne(data);
    res.send(result);
})

router.get('/', async(req, res)=>{
    const data = await userCollection.find({}).toArray();
    res.send(data);
})
router.get('/:id', async(req, res)=>{
    const data = await userCollection.findOne({_id: new ObjectId(req.params.id)});
    res.send(data);
})

router.put('/:id', async(req, res)=>{
    const updatedData = req.body;
    delete updatedData._id;
    const query = {_id: new ObjectId(req.params.id)}
    const updateDoc = {$set: updatedData}
    const data = await userCollection.updateOne(query, updateDoc, {upsert: true});
    res.send(data);
})

module.exports = router