const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');

module.exports = function createEntityRouter(controller) {
  const router = express.Router();

  router.use(protect);

  router.route('/')
    .get(controller.getAll)
    .post(controller.createOne);

  router.route('/:id')
    .all(validateObjectId)
    .get(controller.getOne)
    .put(controller.updateOne)
    .patch(controller.updateOne)
    .delete(controller.deleteOne);

  return router;
};
