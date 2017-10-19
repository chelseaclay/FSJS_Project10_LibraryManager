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
  var page = req.query.page || 1;
  var offset = (page - 1) * 5;
  var pagination = [];

  Book.count({
    distinct: true,
    col: 'id'
  }).then(function(count) {
    var pageNums = Math.ceil(count / 5);
    for(var i = 0; i < pageNums; i++) {
      pagination.push(i + 1);
    }
  });

  Book.findAll({
    order: [
      ['title', 'ASC']
    ],
    limit: 5,
    offset: offset
  }).then(function(books) {
    res.render('list_book', {books, pages: pagination, bookStatus: '/books'});
  });
});

/////////////////////////////
/* Get overdue Books */
/////////////////////////////
router.get('/overdue_book', function(req, res, next) {
  var page = req.query.page || 1;
  var offset = (page - 1) * 5;
  var pagination = [];

  Book.count({
    distinct: true,
    col: 'id',
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
  }).then(function(count) {
    var pageNums = Math.ceil(count / 5);
    for(var i = 0; i < pageNums; i++) {
      pagination.push(i + 1);
    }
  });

  Book.findAll({
    order: [
      ['title', 'ASC']
    ],
    limit: 5,
    offset: offset,
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
    res.render('list_book', {books, pages: pagination, bookStatus: '/books/overdue_loan'});
  });
});

/////////////////////////////
/* Get checked out Books */
/////////////////////////////
router.get('/checked_book', function(req, res, next) {
  var page = req.query.page || 1;
  var offset = (page - 1) * 5;
  var pagination = [];

  Book.count({
    distinct: true,
    col: 'id',
    include: [
      {
        model: Loan,
        where: {
          returned_on: null,
        }
      }
    ]
  }).then(function(count) {
    var pageNums = Math.ceil(count / 5);
    for(var i = 0; i < pageNums; i++) {
      pagination.push(i + 1);
    }
  });

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
    ],
    limit: 5,
    offset: offset
  }).then(function(books) {
    res.render('list_book', {books, pages: pagination, bookStatus: '/books/checked_'});
  });
});

/////////////////////////////
/* Post new book */
/////////////////////////////
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(function() {
    res.redirect('/books');
  }).catch(function(error) {
    if (error){
      res.render("new_book",{errors: error.errors, title: req.body.title, genre: req.body.genre, author: req.body.author, first_published: req.body.first_published});
    }
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
  var errors = [];
  var title = req.body.title;
  var author = req.body.author;
  var genre = req.body.genre;

  if (!title) {
    errors.push('Title is required')
  } else if (!author) {
    errors.push('Author is required');
  } else if (!genre) {
    errors.push('Genre is required');
  } else if (SequelizeUniqueConstraintError) {
    errors.push('Title already exists');
  } else if (SequelizeValidationError) {
    errors.push('First Published must be formatted YYYY');
  }

  if (errors.length > 0) {
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
      res.render('details_book', {book: values[0], loans: values[1], errors: errors});
    });
  } else {
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
      }).then(function() {
        res.redirect('/books');
      });
    });
  }
});

/////////////////////////////
/* Get return book form */
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
    res.render('return_book', {loan: loans[0], patron: loans[1], book: loans[2], todaysDateString});
  });
});

/////////////////////////////
/* Return book */
/////////////////////////////
router.post('/:id/return', (req, res, next) => {
  var errors = [];
  var returned_on = req.body.returned_on;

  if (!returned_on) {
    errors.push('Return date is required')
  } else if (returned_on < todaysDateString) {
    errors.push('Please enter a valid return date');
  }

  if (errors.length > 0) {
    Loan.findAll({
      where: [{
        book_id : req.params.id
      }],
      include: [
        {model: Patron},
        {model: Book}
      ]
    }).then(function(loans) {
      res.render('return_book', {loan: loans[0], patron: loans[1], book: loans[2], todaysDateString, errors: errors});
    });
  } else {
    Loan.update(req.body, {
      where: [{
        book_id: req.params.id
      }]
    }).then(function() {
      res.redirect('/loans');
    });
  }
});

module.exports = router;
