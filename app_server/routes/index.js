var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.home);

/* GET privacy policy page */
router.get('/privacypolicy', ctrlMain.privacy);

/* GET book page */
router.get('/book/:bookname', ctrlMain.book);


module.exports = router;