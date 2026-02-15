const router = require('express').Router();
const controller = require('../controllers/products');
const requireAuth = require('../middleware/requireAuth');

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);

router.post(
  '/',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Create a product',
        required: true,
        schema: {
          "name": "Test Widget",
          "sku": "WID-001",
          "price": 9.99,
          "quantity": 25
        }
  } */
  requireAuth,
  controller.create
);

router.put(
  '/:id',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Update a product',
        required: true,
        schema: {
          "name": "Test Widget Updated",
          "sku": "WID-001",
          "price": 12.49,
          "quantity": 30
        }
  } */
  requireAuth,
  controller.update
);

router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
