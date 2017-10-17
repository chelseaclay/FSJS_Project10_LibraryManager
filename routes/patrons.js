var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;
var Book = require('../models').Book;
var Loan = require('../models').Loan;

/////////////////////////////
/* Get new patron form */
/////////////////////////////
router.get('/new', function(req, res, next) {
  res.render('new_patron');
});

/////////////////////////////
/* Get all Patrons */
/////////////////////////////
router.get('/', function(req, res, next) {
  Patron.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  }).then(function(patrons) {
    res.render('list_patron', {patrons});
  });
});

/////////////////////////////
/* Post new patron */
/////////////////////////////
router.post('/new', function(req, res, next) {
  Patron.create(req.body).then(function() {
    res.redirect('/patrons');
  });
});

/////////////////////////////
/* Get details of patron */
/////////////////////////////
router.get('/:id', function(req, res, next) {
  const foundPatron = Patron.findById(req.params.id);

  const foundLoan = Loan.findAll({
    where: [{
      patron_id : req.params.id
    }],
    include: [
      {model: Patron},
      {model: Book}
    ]
  });

  Promise.all([foundPatron, foundLoan]).then(function(values) {
    console.log(values);
    res.render('details_patron', {patron: values[0], loans: values[1]});
  });
});

/////////////////////////////
/* Update book */
/////////////////////////////
router.post('/:id', function(req, res, next) {
  const foundPatron = Patron.findById(req.params.id);

  const foundLoan = Loan.findAll({
    where: [{
      patron_id : req.params.id
    }],
    include: [
      {model: Patron},
      {model: Book}
    ]
  });

  Promise.all([foundPatron, foundLoan]).then(function(values) {
    Patron.update(req.body, {
      where: [{
        id : req.params.id
      }]
    }).then(function() {
      res.redirect('/patrons');
    });
  });
});

module.exports = router;
