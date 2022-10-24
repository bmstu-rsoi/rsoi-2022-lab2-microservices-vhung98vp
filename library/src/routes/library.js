const router = require('express').Router();
const controller = require('../controllers/libraryController');

router
  .get('/', controller.getLibrariesByCity)
  .get('/:libraryUid/books', controller.getBooksByLibrary)
  .get('/:libraryUid', controller.getLibraryByUid)
  // .post('/books', controller.createRelation)
  // .get('/', controller.getAll)
  // .post('/', controller.createOne)
  // .get('/:id', controller.getOne)  
  // .patch('/:id', controller.updateOne)
  // .delete('/:id', controller.deleteOne);

module.exports = router;