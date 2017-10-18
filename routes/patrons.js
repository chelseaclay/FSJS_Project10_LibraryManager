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
  var searched = req.query.search;

  if(searched != undefined) {
    Patron.findAll({
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC']
      ],
      where: {
        $or: [{
          first_name: {
            $like: '%' + req.query.search + '%'
          }
        }, {
          last_name: {
            $like: '%' + req.query.search + '%'
          }
        }, {
          address: {
            $like: '%' + req.query.search + '%'
          }
        }, {
          email: {
            $like: '%' + req.query.search + '%'
          }
        }
        , {
          library_id: {
            $like: '%' + req.query.search + '%'
          }
        }
        , {
          zip_code: {
            $like: '%' + req.query.search + '%'
          }
        }]
      }
    }).then((patrons) => {
      res.render('list_patron', {patrons});
    });
  }

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
  }).catch(function(error) {
    if (error){
      res.render("new_patron",{errors: error.errors});
    }
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
  var errors = [];
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var address = req.body.address;
  var email = req.body.email;
  var libraryID = req.body.library_id;
  var zipCode = req.body.zip_code;

  if (!firstName) {
    errors.push('First Name is required')
  } else if (!lastName) {
    errors.push('Last Name is required');
  } else if (!address) {
    errors.push('Address is required');
  } else if (!email) {
    errors.push('Email is required');
  } else if (!libraryID) {
    errors.push('Library ID is required');
  } else if (!zipCode) {
    errors.push('Zip Code is required');
  }

  if (errors.length > 0) {
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
      res.render('details_patron', {patron: values[0], loans: values[1], errors: errors});
    });
  } else {
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
  }
});

/////////////////////////////
/* Search patrons */
/////////////////////////////
router.get('/search', function (req, res) {
  var searched = req.query.search;
  console.log(searched);
    Patron.findAll({
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC']
      ],
      where: {
        // first_name: {
        //   $like: '%' + req.query.search + '%'
        // },
        last_name: {
          $like: '%' + req.query.search + '%'
        }
        // ,
        // address: {
        //   $like: '%' + req.query.search + '%'
        // },
        // email: {
        //   $like: '%' + req.query.search + '%'
        // },
        // library_id: {
        //   $like: '%' + req.query.search + '%'
        // },
        // zip_code: {
        //   $like: '%' + req.query.search + '%'
        // }
      }
    }).then((patrons) => {
      res.render('list_patron', {patrons});
    });
});

module.exports = router;
