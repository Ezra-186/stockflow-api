const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const collection = () => mongodb.getDb().collection('products');

const getAll = async (req, res) => {
  try {
    const result = await collection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().findOne({ _id: id });

    if (!result) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const { name, sku, price, quantity } = req.body;

    if (!name || !sku || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: 'Missing required fields: name, sku, price, quantity'
      });
    }

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      return res.status(400).json({
        message: 'price and quantity must be numbers'
      });
    }

    const product = { name, sku, price, quantity };
    const result = await collection().insertOne(product);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const id = new ObjectId(req.params.id);
    const { name, sku, price, quantity } = req.body;

    if (!name || !sku || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: 'Missing required fields: name, sku, price, quantity'
      });
    }

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      return res.status(400).json({
        message: 'price and quantity must be numbers'
      });
    }

    const product = { name, sku, price, quantity };

    const result = await collection().replaceOne({ _id: id }, product);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().deleteOne({ _id: id });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
