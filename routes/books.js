var express = require('express');
var router = express.Router();

/* GET pug files for each url. */
router.get('/new', function(req, res, next) {
  res.render('new_book');
});

router.get('/', function(req, res, next) {
  res.render('list_book');
});

router.get('/overdue_book', function(req, res, next) {
  res.render('overdue_book');
});

router.get('/checked_book', function(req, res, next) {
  res.render('checked_book');
});

module.exports = router;
