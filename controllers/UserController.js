const { ObjectId } = require('mongodb');
const mongodb = require('../db/connect');




// GET everything in the users databse:
const getUser = async (req, res, next) => {
    try{
         const db = mongodb.getDb().db();
         const result = await db.collection('user').find();
         const list = await result.toArray();
         res.setHeader('Content-Type', 'application/json');
         res.status(200).json(list);
    } catch (error) {
        console.error('Error fetching contact info', error);
        res.status(500).json({ error: 'Internal server error'});
    }
};

// GET one specific contact in the database:
const getSingleUser = async (req, res, next) => {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('user')
      .find({ _id: userId });
    result.toArray().then((list) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(list[0]);
    });
  };



  // Update existing contact:
  const updateUser = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const user = {
      username: req.body.username,
      phone: req.body.phone
    };
    console.log(req.body);
    console.log(user);
    const response = await mongodb
      .getDb()
      .db()
      .collection('user')
      .replaceOne({ _id: userId }, user);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the contact.');
    }
  };


  const addUser = async (req, res) => {
    const user = {
      username: req.body.username,
      phone: req.body.phone
    };
    console.log(req);
    console.log(req.body);
    console.log(user);
    const response = await mongodb.getDb().db().collection('user').insertOne(user);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
  };

  const deleteUser = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('user').deleteOne({ _id: userId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
  };


module.exports = {getUser, getSingleUser, updateUser, addUser, deleteUser};