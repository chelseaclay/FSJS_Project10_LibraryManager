var express = require('express');
var router = express.Router();
var Patron = require('../models').Patron;

/* GET pug files for each url. */
router.get('/new', function(req, res, next) {
  res.render('new_patron');
});

router.get('/', function(req, res, next) {
  Patron.findAll({
    order: [
      ['first_name', 'ASC'],
      ['last_name', 'ASC']
    ]
  }).then(function(patrons) {
    console.log(patrons);
    res.render('list_patron', {patrons});
  });
});

module.exports = router;
