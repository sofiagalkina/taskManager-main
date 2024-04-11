const { ObjectId } = require('mongodb');
const { body, validationResult } = require('express-validator');
const mongodb = require('../db/connect');

// validation middleware for addUser:
const validateAddUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

// validation middleware for updateUser:
const validateUpdateUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
];

// GET everything in the users database:
const getUser = async (req, res, next) => {
  try {
    const db = mongodb.getDb().db();
    const result = await db.collection('user').find();
    const list = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(list);
  } catch (error) {
    console.error('Error fetching user info', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET one specific user in the database:
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

// Update existing user:
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = new ObjectId(req.params.id);
  const user = {
    username: req.body.username,
    phone: req.body.phone,
  };

  const response = await mongodb
    .getDb()
    .db()
    .collection('user')
    .replaceOne({ _id: userId }, user);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while updating the user.');
  }
};

// Add new user:
const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = {
    username: req.body.username,
    phone: req.body.phone,
  };

  const response = await mongodb
    .getDb()
    .db()
    .collection('user')
    .insertOne(user);

  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while creating the user.');
  }
};

// Delete user:
const deleteUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db()
    .collection('user')
    .deleteOne({ _id: userId }, true);

  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res
      .status(500)
      .json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = { getUser, getSingleUser, updateUser, addUser, deleteUser };
