var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var todaysDate = new Date();

/////////////////////////////
/* GET pug files for each url. */
/////////////////////////////
router.get('/new', function(req, res, next) {
  res.render('new_book');
});

/////////////////////////////
/* Get all Books */
/////////////////////////////
router.get('/', function(req, res, next) {
  Book.findAll({
    order: [
      ['title', 'ASC']
    ]
  }).then(function(books) {
    res.render('list_book', {books});
  });
});

/////////////////////////////
/* Get overdue Books */
/////////////////////////////
router.get('/overdue_book', function(req, res, next) {
  Book.findAll({
    include: [
      {
        model: Loan,
        where: {
          returned_on: null,
          return_by: {
            lt: todaysDate
          }
        }
      }
    ]
  }).then(function(books) {
    res.render('overdue_book', {books});
  });
});

/////////////////////////////
/* Get checked out Books */
/////////////////////////////
router.get('/checked_book', function(req, res, next) {
  Book.findAll({
    include: [
      {
        model: Loan,
        where: {
          returned_on: null,
        }
      }
    ]
  }).then(function(books) {
    res.render('checked_book', {books});
  });
});

module.exports = router;
