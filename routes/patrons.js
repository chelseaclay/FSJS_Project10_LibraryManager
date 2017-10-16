var express = require('express');
var router = express.Router();

/* GET pug files for each url. */
router.get('/new', function(req, res, next) {
  res.render('new_patron');
});

router.get('/', function(req, res, next) {
  res.render('list_patron');
});

module.exports = router;
