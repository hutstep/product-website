var express = require('express');
var router = express.Router();
var ctrlBooks = require('../controllers/books');

// books
router.get('/books', ctrlBooks.booksReadAll);
router.get('/books/:bookname', ctrlBooks.booksReadOne);

module.exports = router;