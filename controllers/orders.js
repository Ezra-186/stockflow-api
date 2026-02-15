const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const collection = () => mongodb.getDb().collection('orders');

const validateOrder = ({ customerId, items, subtotal, tax, total, status, createdAt, notes }) => {
  if (
    !customerId ||
    !Array.isArray(items) ||
    items.length === 0 ||
    subtotal === undefined ||
    tax === undefined ||
    total === undefined ||
    !status ||
    !createdAt
  ) {
    return 'Missing required fields: customerId, items, subtotal, tax, total, status, createdAt';
  }

  if (typeof customerId !== 'string' || typeof status !== 'string' || typeof createdAt !== 'string') {
    return 'customerId, status, and createdAt must be strings';
  }

  if (!Number.isFinite(subtotal) || !Number.isFinite(tax) || !Number.isFinite(total)) {
    return 'subtotal, tax, and total must be numbers';
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return 'notes must be a string';
  }

  const hasInvalidItem = items.some((item) => {
    return (
      !item ||
      typeof item.productId !== 'string' ||
      typeof item.name !== 'string' ||
      !Number.isFinite(item.price) ||
      !Number.isFinite(item.quantity)
    );
  });

  if (hasInvalidItem) {
    return 'Each item must include productId, name, price, and quantity';
  }

  return null;
};

const getAll = async (req, res) => {
  try {
    const result = await collection().find().toArray();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().findOne({ _id: id });

    if (!result) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const create = async (req, res) => {
  try {
    const { customerId, items, subtotal, tax, total, status, createdAt, notes } = req.body;
    const validationError = validateOrder({
      customerId,
      items,
      subtotal,
      tax,
      total,
      status,
      createdAt,
      notes
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const order = { customerId, items, subtotal, tax, total, status, createdAt, notes };
    const result = await collection().insertOne(order);

    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const update = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const { customerId, items, subtotal, tax, total, status, createdAt, notes } = req.body;
    const validationError = validateOrder({
      customerId,
      items,
      subtotal,
      tax,
      total,
      status,
      createdAt,
      notes
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const id = new ObjectId(req.params.id);
    const order = { customerId, items, subtotal, tax, total, status, createdAt, notes };
    const result = await collection().replaceOne({ _id: id }, order);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const remove = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const id = new ObjectId(req.params.id);
    const result = await collection().deleteOne({ _id: id });

    if (result.deletedCount === 0) return res.status(404).json({ message: 'Order not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAll, getSingle, create, update, remove };
