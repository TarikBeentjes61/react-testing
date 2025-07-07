const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function getDB() {
  if (!db) {
    await client.connect();
    db = client.db('CodingChallenges'); 
    console.log('Connected to MongoDB');
  }
  return db;
}

function getChallengesCollection() {
  if (!db) throw new Error('DB not initialized. Call getDB first.');
  return db.collection('challenges');
}

function getSolvedChallengesCollection() {
  if (!db) throw new Error('DB not initialized. Call getDB first.');
  return db.collection('solvedChallenges');
}

function getUsersCollection() {
  if (!db) throw new Error('DB not initialized. Call getDB first.');
  return db.collection('users');
}

async function disconnectFromDB() {
  if (!db) throw new Error('DB not initialized. Call getDB first.');
  await client.close();
  db = null;
}

module.exports = { getDB, disconnectFromDB, getChallengesCollection, getSolvedChallengesCollection, getUsersCollection };
