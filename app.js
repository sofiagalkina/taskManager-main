/*
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');
const contactsRoutes = require('./routes/contacts');

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/professional', professionalRoutes);

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const contactsRoutes = require('./routes/contacts');

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

// Routes
app.use('/contacts', contactsRoutes); // Assuming contactsRoutes handles contacts-related routes

// Initialize MongoDB connection
mongodb.initDb((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
