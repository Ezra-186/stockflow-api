const router = require('express').Router();
const controller = require('../controllers/customers');

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);

router.post(
  '/',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Create a customer',
        required: true,
        schema: {
          "firstName": "Ezra",
          "lastName": "Test",
          "email": "Ezra@example.com"
        }
  } */
  controller.create
);

router.put(
  '/:id',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Update a customer',
        required: true,
        schema: {
          "firstName": "Ezra",
          "lastName": "Update",
          "email": "Ezra.Update@example.com",
          "phone": "555-999-0000",
          "address": "456 New Address Ave"
        }
  } */
  controller.update
);
router.delete('/:id', controller.remove);

module.exports = router;
