var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;

/* GET pug files for each url. */
router.get('/new', function(req, res, next) {
  res.render('new_loan');
});

router.get('/', function(req, res, next) {
  Loan.findAll({
    include: [
      {model: Patron},
      {model: Book}
    ]
  }).then(function(loans) {
    res.render('list_loan', {loans});
  });
});

router.get('/overdue_loans', function(req, res, next) {
  res.render('overdue_loan');
});

router.get('/checked_loans', function(req, res, next) {
  res.render('checked_loan');
});

module.exports = router;
