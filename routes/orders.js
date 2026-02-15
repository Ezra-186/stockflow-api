const router = require('express').Router();
const controller = require('../controllers/orders');
const requireAuth = require('../middleware/requireAuth');

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);

router.post(
  '/',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Create an order',
        required: true,
        schema: {
          "customerId": "507f191e810c19729de860ea",
          "items": [
            {
              "productId": "507f191e810c19729de860eb",
              "name": "Test Widget",
              "price": 9.99,
              "quantity": 2
            }
          ],
          "subtotal": 19.98,
          "tax": 1.6,
          "total": 21.58,
          "status": "pending",
          "createdAt": "2026-02-12T00:00:00.000Z",
          "notes": "Leave at front desk"
        }
  } */
  requireAuth,
  controller.create
);

router.put(
  '/:id',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Update an order',
        required: true,
        schema: {
          "customerId": "507f191e810c19729de860ea",
          "items": [
            {
              "productId": "507f191e810c19729de860eb",
              "name": "Test Widget",
              "price": 9.99,
              "quantity": 3
            }
          ],
          "subtotal": 29.97,
          "tax": 2.4,
          "total": 32.37,
          "status": "processing",
          "createdAt": "2026-02-12T00:00:00.000Z",
          "notes": "Customer requested gift wrap"
        }
  } */
  requireAuth,
  controller.update
);

router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
