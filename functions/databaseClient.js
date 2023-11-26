const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
// mongo DB client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxy8ozq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// database and collections
let database = client.db('contestPlatform')
let userCollection = database.collection('users')
let contestCollection = database.collection('contests')
let registrationCollection = database.collection('contestRegistration')

const connectDB = async () => {
  const mongoURI = uri;

  await mongoose.connect(mongoURI, { dbName: process.env.DB_USER });
  console.log("connected to database by mongoose");
};

module.exports = {
    client,
    userCollection,
    contestCollection,
    connectDB,
    registrationCollection
}
