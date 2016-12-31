var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
  res.render('addcategory', {
    'title': 'add category'
  });
});

router.post('/add', function(req, res, next){
  var title = req.body.title;

  // form validation
  req.checkBody('title', 'title field is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('addcategory', {
      'errors': errors,
      'title': title
    });
  } else {
    var categories = db.get('categories');

    // submit to db
    categories.insert({
      'title': title
    }, function(err, category){
      if (err) {
        res.send('there was an issue adding the category');
      } else {
        req.flash('success', 'category added');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
