const express = require('express')
const router = express.Router()

// functions import
const { registrationCollection, contestCollection, userCollection } = require('../functions/databaseClient');
const { ObjectId } = require('mongodb');

router.post('/', async(req, res)=>{
    const data = req.body;
    console.log(data)
    const result = await registrationCollection.insertOne(data);
    res.send(result);
})

router.get('/single-contest-submissions/:id', async(req, res)=>{
    const query = {contestId: req.params.id};
    const result = await registrationCollection.find(query).toArray();
    res.send(result);
})

// router.get('/submitted-tasks/:email', async(req, res)=>{
//     const query = {userEmail: req.params.email, submitted: true};
//     const result = await registrationCollection.find(query).toArray();
//     res.send(result);
// })


router.get('/particular-contests/:email', async(req, res)=>{
    const query = {userEmail: req.params.email};
    const registration = await registrationCollection.find(query).toArray();
    const allContest = await contestCollection.find({}).toArray();
    let data = [];
    registration.forEach((r)=>{
          allContest.forEach((a)=>{
            if(r.contestId === a._id.toString()) data.push({...r, contest: a})
          })
    })
    const sortedArray = data.sort((a, b) => new Date(a?.contest?.contestDeadline) - new Date(b?.contest?.contestDeadline))
    res.send(sortedArray);
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
router.get ('/winning-ratio/:email', async(req, res)=>{
    const email = req.params.email;
    const contest = await contestCollection.find({winnerEmail: email}).toArray();
    const registration = await registrationCollection.find({userEmail:email, submitted:true}).toArray();
    const data = {
        attempted: registration.length,
        win: contest.length
    }
    res.send(data)
})
router.put('/set-winner/:id', async(req, res)=>{
    const updatedData = {
        ...req.body, 
        winner:true
    }
    delete updatedData._id;
    const query = {
        _id: new ObjectId(req.params.id)
    }
    const updateDoc = {$set: updatedData}
    const data = await registrationCollection.updateOne(query, updateDoc, {upsert: true});
    const user = await userCollection.findOne({userEmail : req.body.userEmail});
    const winnerDoc = {
        $set: {
            winnerImage: user?.photoURL,
            winnerName: user?.userName
        }
    }
    const contest = await contestCollection.updateOne({_id: new ObjectId(req.body.contestId)}, winnerDoc, {upsert: true});
    res.send(data);
})

module.exports = router