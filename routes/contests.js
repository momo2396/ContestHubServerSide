const express = require('express')
const router = express.Router()

// functions import
const { contestCollection, userCollection } = require('../functions/databaseClient');
const { ObjectId } = require('mongodb');

router.post('/', async(req, res)=>{
    const data = req.body;
    const result = await contestCollection.insertOne(data);
    res.send(result);
})

router.get('/', async(req, res)=>{
    const data = await contestCollection.find({}).toArray();
    res.send(data);
})

router.get('/single-contest/:id', async(req, res)=>{
    const query = {_id: new ObjectId(req.params.id)}
    const data = await contestCollection.findOne(query);
    res.send(data);
})

router.delete('/single-contest/:id', async(req, res)=>{
    const query = {_id: new ObjectId(req.params.id)}
    const data = await contestCollection.deleteOne(query);
    res.send(data);
})


router.put('/single-contest/:id', async(req, res)=>{
    const updatedData = req.body;
    delete updatedData._id;
    const query = {_id: new ObjectId(req.params.id)}
    const updateDoc = {$set: updatedData}
    const data = await contestCollection.updateOne(query, updateDoc, {upsert: true});
    res.send(data);
})

router.get('/all-winners', async(req, res)=>{
    const allUsers = await userCollection.find({}).toArray();
    const allContests = await contestCollection.find({}).toArray();
    const winners={};
    allUsers.forEach((a)=>{
        winners[a.userEmail] = {
            won:0, 
            user: a
        }
    })
    allContests.forEach((a)=>{
        if(a.winnerEmail)
        winners[a.winnerEmail] = {
           ...winners[a.winnerEmail], won: winners[a.winnerEmail].won+1
        }
    })
    const winnerArray = Object.values(winners)
    const sortedWinners = winnerArray.sort((a,b)=>b.won - a.won)
    res.send(sortedWinners)
})
router.get('/popular-contests', async(req, res)=>{
    const data = await contestCollection.find({}).sort({participationCount: -1}).limit(5).toArray();
    res.send(data);
})

router.get('/single-category-contest', async(req, res)=>{
    const query = {contestType: req.query.contestType}
    const data = await contestCollection.find(query).toArray();
    res.send(data);
})

router.get('/categories', async(req, res)=>{
    const categories = [];
    const data = await contestCollection.find({}).toArray();
    data.forEach((c)=>{
        if(!categories.includes(c.contestType)) categories.push(c.contestType);
    })
    categories.sort();
    res.send(categories);
})

router.get('/my-created-contests/:email', async(req, res)=>{
    const query = {contestCreatorMail: req.params.email}
    const data = await contestCollection.find(query).toArray();
    res.send(data);
})

module.exports = router