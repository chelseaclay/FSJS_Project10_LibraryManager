var express = require('express');
var router = express.Router();

/* GET pug files for each url. */
router.get('/new', function(req, res, next) {
  res.render('new_loan');
});

router.get('/', function(req, res, next) {
  res.render('list_loan');
});

router.get('/overdue_loans', function(req, res, next) {
  res.render('overdue_loan');
});

router.get('/checked_loans', function(req, res, next) {
  res.render('checked_loan');
});

module.exports = router;
