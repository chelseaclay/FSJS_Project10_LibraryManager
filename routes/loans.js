var express = require('express');
var router = express.Router();
var Loan = require('../models').Loan;
var Book = require('../models').Book;
var Patron = require('../models').Patron;
var todaysDate = new Date();
var todaysDateString = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + todaysDate.getDate();
var returnDateString = todaysDate.getFullYear() + '-' + (todaysDate.getMonth() + 1) + '-' + (todaysDate.getDate() + 7);

/////////////////////////////
/* Get new loan form */
/////////////////////////////
router.get('/new', function(req, res, next) {
  const allBooks = Book.findAll({
    order: [
      ['title', 'ASC']
    ],
    include: [{
      model: Loan
    }]
  });

  const allPatrons = Patron.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  });

  Promise.all([allBooks, allPatrons]).then(function(values) {
    console.log(values[0][0]);
    res.render('new_loan', {books: values[0], patrons: values[1], todaysDateString, returnDateString});
  });
});

/////////////////////////////
/* Get all Loans */
/////////////////////////////
router.get('/', function(req, res, next) {
  var page = req.query.page || 1;
  var offset = (page - 1) * 5;
  var pagination = [];

  Loan.count({
    col: 'book_id',
    include: [
      {model: Patron},
      {model: Book}
    ]
  }).then(function(count) {
    var pageNums = Math.ceil(count / 5);
    for(var i = 0; i < pageNums; i++) {
      pagination.push(i + 1);
    }
  });

  Loan.findAll({
    include: [
      {model: Patron},
      {model: Book}
    ],
    limit: 5,
    offset: offset
  }).then(function(loans) {
    res.render('list_loan', {loans, pages: pagination, bookStatus: '/loans'});
  });
});

/////////////////////////////
/* Get overdue Loans */
/////////////////////////////
router.get('/overdue_loans', function(req, res, next) {
  var page = req.query.page || 1;
  var offset = (page - 1) * 5;
  var pagination = [];

  Loan.count({
    distinct: true,
    col: 'book_id',
    where: {
      returned_on: null,
      return_by: {
        lt: todaysDate
      }
    },
    include: [
      {model: Book},
      {model: Patron}
    ]
  }).then(function(count) {
    var pageNums = Math.ceil(count / 5);
    for(var i = 0; i < pageNums; i++) {
      pagination.push(i + 1);
    }
  });

  Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        lt: todaysDate
      }
    },
    include: [
      {model: Book},
      {model: Patron}
    ],
    limit: 5,
    offset: offset
  }).then(function(loans) {
    res.render('list_loan', {loans, pages: pagination, bookStatus: '/loans/overdue_loans'});
  });
});

/////////////////////////////
/* Get checked out Loans */
/////////////////////////////
router.get('/checked_loans', function(req, res, next) {
  var page = req.query.page || 1;
  var offset = (page - 1) * 5;
  var pagination = [];

  Loan.count({
    distinct: true,
    col: 'book_id',
    where: {
      returned_on: null,
    },
    include: [
      {model: Book},
      {model: Patron}
    ]
  }).then(function(count) {
    var pageNums = Math.ceil(count / 5);
    for(var i = 0; i < pageNums; i++) {
      pagination.push(i + 1);
    }
  });

  Loan.findAll({
    where: {
      returned_on: null,
    },
    include: [
      {model: Book},
      {model: Patron}
    ],
    limit: 5,
    offset: offset
  }).then(function(loans) {
    res.render('list_loan', {loans, pages: pagination, bookStatus: '/loans/checked_loans'});
  });
});

/////////////////////////////
/* Post new loan */
/////////////////////////////
router.post('/new', function(req, res, next) {
  Loan.create(req.body).then(function() {
    res.redirect('/loans');
  }).catch(function(error) {
    const allBooks = Book.findAll({
      order: [
        ['title', 'ASC']
      ]
    });

    const allPatrons = Patron.findAll({
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC']
      ]
    });

    Promise.all([allBooks, allPatrons]).then(function(values) {
      res.render('new_loan', {books: values[0], patrons: values[1], todaysDateString, returnDateString, errors: error.errors, todaysDateString: req.body.loaned_on, returnDateString: req.body.return_by});
    });
  });
});

module.exports = router;
