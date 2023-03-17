const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

// Replace "myMongoDBUrl" with the connection string for your MongoDB instance
const mongoUrl = 'mongodb+srv://bkhope:aaaaaaaa@cluster0.fr45hjl.mongodb.net/test';
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB', err);
  } else {
    console.log('Connected to MongoDB');
  }
});