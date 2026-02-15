const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'StockFlow API is running' });
});

router.use('/products', require('./products'));
router.use('/customers', require('./customers'));
router.use('/users', require('./users'));
router.use('/orders', require('./orders'));

module.exports = router;
