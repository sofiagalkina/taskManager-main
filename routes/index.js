//instance of router module
const routes = require('express').Router();
const myController = require('../controllers')
const userController = require('../controllers/UserController');

// creating instances of swagger (sofia)
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');


routes.get('/', (req, res) =>{
    res.json({
        status: 'Task Manager API',
        message: 'Welcome to the API'
    });
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
