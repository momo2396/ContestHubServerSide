const express = require('express')
const router = express.Router()

const { userCollection } = require('../functions/databaseClient');
const { ObjectId } = require('mongodb');
const genToken = require('../functions/genToken');

router.post('/', async(req, res)=>{
    const data = req.body;
    const exist = await userCollection.findOne({userEmail: req.body.userEmail})
    if(!exist?._id)
   {
    const result = await userCollection.insertOne(data);
    res.send(result);
   }
   else res.send({})
})

router.get('/', async(req, res)=>{
    const data = await userCollection.find({}).toArray();
    res.send(data);
})
router.get('/:email', async(req, res)=>{
    const data = await userCollection.findOne({userEmail: req.params.email});
    const token = await genToken({userEmail: data?.userEmail, status:data?.status})
    res.send({...data, token});
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