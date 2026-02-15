const router = require('express').Router();
const controller = require('../controllers/users');
const requireAuth = require('../middleware/requireAuth');

router.get('/', controller.getAll);
router.get('/:id', controller.getSingle);

router.post(
  '/',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Create a user',
        required: true,
        schema: {
          "githubId": "12345678",
          "username": "ezra-dev",
          "displayName": "Ezra Dev",
          "email": "ezra@example.com"
        }
  } */
  requireAuth,
  controller.create
);

router.put(
  '/:id',
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Update a user',
        required: true,
        schema: {
          "githubId": "12345678",
          "username": "ezra-updated",
          "displayName": "Ezra Updated",
          "email": "ezra.updated@example.com"
        }
  } */
  requireAuth,
  controller.update
);

router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
