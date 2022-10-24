const router = require('express').Router();
const controller = require('../controllers/controller');

router
  .get('/', controller.getRatingByUsername)
  .patch('/', controller.updateRatingByUsername)
  // .get('/', controller.getAll)
  // .post('/', controller.createOne)
  // .get('/:id', controller.getOne)  
  // .patch('/:id', controller.updateOne)
  // .delete('/:id', controller.deleteOne);

module.exports = router;