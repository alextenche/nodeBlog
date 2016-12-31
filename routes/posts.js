var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer = require('multer');

var upload = multer({ dest: 'uploads/' });

router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
    res.render('addpost', {
      'title': 'add post',
      'categories': categories
    });
  });

});

router.post('/add', upload.single('mainimage'), function(req, res, next){
  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

  if(req.files.mainimage) {
    console.log('adding image');
      var mainImageOriginalName     = req.files.mainimage.originalname;
      var mainImageName             = req.files.mainimage.name;
      var mainImageMime             = req.files.mainimage.mimetype;
      var mainImagePath             = req.files.mainimage.path;
      var mainImageExt              = req.files.mainimage.extension;
      var mainImageSize             = req.files.mainimage.size;
    } else {
      console.log('default no image');
      var mainImageName = 'noimage.jpg';
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
      'mainImage': mainImageName,
    }, function(err, post){
      if (err) {
        res.send('there was an issue submiting the post');
      } else {
        req.flash('success', 'post submited');
        res.location('/');
        res.redirect('/');
      }
    });
  }

});

module.exports = router;
