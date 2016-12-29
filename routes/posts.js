var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add', function(req, res, next) {
  res.render('addpost', {
    'title': 'add post'
  });
});

router.post('/add', function(req, res, next){
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();
  console.log(title);

  if (req.files && req.files.mainImage) {
    var mainImageOriginalName = req.files.mainImage.originalname;
    var mainImageName = req.files.mainImage.name;
    var mainImageMime = req.files.mainImage.mimetype;
    var mainImagePath = req.files.mainImage.path;
    var mainImageExtension = req.files.mainImage.extension;
    var mainImageSize = req.files.mainImage.size;
  } else {
    var mainImageName = 'noimage.png';
  }

  // form validation
  req.checkBody('title', 'title field is required').notEmpty();
  req.checkBody('body', 'body field is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('addpost', {
      'errors': errors,
      'title': title,
      'body': body
    });
  } else {
    var posts = db.get('posts');

    // submit to db
    posts.insert({
      'title': title,
      'body': body,
      'category': category,
      'date': date,
      'author': author,
      'mainImage': mainImage,
    }, function(err, post){
      if (err) {
        res.send('there was an issue submiting the post');
      } else [
        req.flash('success', 'post submited');
        res.location('/');
        res.redirect('/');
      ]
    });
  }

});

module.exports = router;
