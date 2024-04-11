//instance of router module
const express = require('express');
const authRoutes = require('./authRoutes');

const routes = require('express').Router();
const myController = require('../controllers')
const userController = require('../controllers/UserController');




// oauth:
const session = require('express-session');
const passport = require('./auth');
const bcrypt = require('bcryptjs');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes

app.use('/auth', authRoutes);


// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };
  


  // Register route
routes.post('/register', async (req, res) => {
    try {
      const { username, password, phone } = req.body;
  
      // Check if user already exists
      const db = mongodb.getDb().db();
      const existingUser = await db.collection('user').findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = {
        username,
        password: hashedPassword,
        phone,
      };
  
      await db.collection('user').insertOne(newUser);
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error registering user', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Login route
  routes.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Login successful', user: req.user });
  });
  
  // Logout route
  routes.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful' });
  });
  
  







// creating instances of swagger (sofia)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');


routes.get('/', (req, res) =>{
    res.json({
        status: 'Task Manager API',
        message: 'Welcome to the API'
    });
});


// Protected route example
routes.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route' });
  });

// Swagger route (sofia)
routes.use('/api-docs', swaggerUi.serve);
routes.get('/api-docs', swaggerUi.setup(swaggerDocument));


// routes.get('/', myController.testFunction);
routes.get('/user', userController.getUser);
routes.get('/user/:id', userController.getSingleUser);

// PUT request to update existing contact:
routes.put('/user/:id', userController.updateUser);

// POST request to create a new contact:
routes.post('/user', userController.addUser);

// DELETE request to delete existing contact:
routes.delete('/user/:id', userController.deleteUser);


module.exports = routes;
