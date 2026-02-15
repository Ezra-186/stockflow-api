const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const collection = () => mongodb.getDb().collection('users');

const validateUser = ({ githubId, username, displayName, email }) => {
  if (!githubId || !username || !displayName) {
    return 'Missing required fields: githubId, username, displayName';
  }

  if (typeof githubId !== 'string' || typeof username !== 'string' || typeof displayName !== 'string') {
    return 'githubId, username, and displayName must be strings';
  }

  if (email !== undefined && typeof email !== 'string') {
    return 'email must be a string';
  }

  return null;
};

const getAll = async (req, res) => {
  try {
    const result = await collection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().findOne({ _id: id });

    if (!result) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const { githubId, username, displayName, email } = req.body;
    const validationError = validateUser({ githubId, username, displayName, email });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = { githubId, username, displayName, email };
    const result = await collection().insertOne(user);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const { githubId, username, displayName, email } = req.body;
    const validationError = validateUser({ githubId, username, displayName, email });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const id = new ObjectId(req.params.id);
    const user = { githubId, username, displayName, email };
    const result = await collection().replaceOne({ _id: id }, user);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().deleteOne({ _id: id });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
