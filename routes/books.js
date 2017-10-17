var express = require('express');
var router = express.Router();
var Book = require('../models').Book;
var Patron = require('../models').Patron;
var Loan = require('../models').Loan;
var todaysDate = new Date();
var todaysDateString = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate();

/////////////////////////////
/* Get new book form */
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
    order: [
      ['title', 'ASC']
    ],
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
    res.render('list_book', {books});
  });
});

/////////////////////////////
/* Get checked out Books */
/////////////////////////////
router.get('/checked_book', function(req, res, next) {
  Book.findAll({
    order: [
      ['title', 'ASC']
    ],
    include: [
      {
        model: Loan,
        where: {
          returned_on: null,
        }
      }
    ]
  }).then(function(books) {
    res.render('list_book', {books});
  });
});

/////////////////////////////
/* Post new book */
/////////////////////////////
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(function() {
    res.redirect('/books');
  });
});

/////////////////////////////
/* Get details of book */
/////////////////////////////
router.get('/:id', function(req, res, next) {
  const foundBook = Book.findById(req.params.id);

  const foundLoan = Loan.findAll({
    where: [{
      book_id : req.params.id
    }],
    include: [
      {model: Patron},
      {model: Book}
    ]
  });

  Promise.all([foundBook, foundLoan]).then(function(values) {
    res.render('details_book', {book: values[0], loans: values[1]});
  });
});

/////////////////////////////
/* Update book */
/////////////////////////////
router.post('/:id', function(req, res, next) {
  const foundBook = Book.findById(req.params.id);

  const foundLoan = Loan.findAll({
    where: [{
      book_id : req.params.id
    }],
    include: [
      {model: Patron},
      {model: Book}
    ]
  });

  Promise.all([foundBook, foundLoan]).then(function(values) {
    Book.update(req.body, {
      where: [{
        id : req.params.id
      }]
    });
  }).then(function() {
    res.redirect('/books');
  });
});

/////////////////////////////
/* Return book */
/////////////////////////////
router.get('/:id/return', function(req, res, next) {
  Loan.findAll({
    where: [{
      book_id : req.params.id
    }],
    include: [
      {model: Patron},
      {model: Book}
    ]
  }).then(function(loans) {
    console.log(loans);
    res.render('return_book', {loan: loans[0], patron: loans[1], book: loans[2], todaysDateString});
  });
});

module.exports = router;
