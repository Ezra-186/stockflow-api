const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const collection = () => mongodb.getDb().collection('customers');

const getAll = async (req, res) => {
  try {
    const result = await collection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().findOne({ _id: id });

    if (!result) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: 'Missing required fields: firstName, lastName, email'
      });
    }

    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string') {
      return res.status(400).json({
        message: 'firstName, lastName, and email must be strings'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'email must include @' });
    }

    if (phone !== undefined && typeof phone !== 'string') {
      return res.status(400).json({ message: 'phone must be a string' });
    }

    if (address !== undefined && typeof address !== 'string') {
      return res.status(400).json({ message: 'address must be a string' });
    }

    const customer = { firstName, lastName, email, phone, address };
    const result = await collection().insertOne(customer);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const id = new ObjectId(req.params.id);
    const { firstName, lastName, email, phone, address } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: 'Missing required fields: firstName, lastName, email'
      });
    }

    if (typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string') {
      return res.status(400).json({
        message: 'firstName, lastName, and email must be strings'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ message: 'email must include @' });
    }

    if (phone !== undefined && typeof phone !== 'string') {
      return res.status(400).json({ message: 'phone must be a string' });
    }

    if (address !== undefined && typeof address !== 'string') {
      return res.status(400).json({ message: 'address must be a string' });
    }

    const customer = { firstName, lastName, email, phone, address };

    const result = await collection().replaceOne({ _id: id }, customer);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid customer id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().deleteOne({ _id: id });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'Customer not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
