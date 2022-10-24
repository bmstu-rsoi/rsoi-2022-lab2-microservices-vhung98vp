const router = require('express').Router();
const controller = require('../controllers/controller');

router
  .get('/', controller.getReservationsByUsername)
  .post('/', controller.takeBook)
  .post('/:reservationUid/return', controller.returnBook)
  // .get('/', controller.getAll)
  // .post('/', controller.createOne)
  // .get('/:id', controller.getOne)  
  // .patch('/:id', controller.updateOne)
  // .delete('/:id', controller.deleteOne);

module.exports = router;