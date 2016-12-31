var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');


router.get('/add', function(req, res, next) {
  var categories = db.get('categories');

  categories.find({}, {}, function(err, categories){
    res.render('addpost', {
      title: 'add post',
      categories: categories
    });
  });

});



router.post('/add', function(req, res, next){

  console.log('--> file:' + req.file);

  var title = req.body.title;
  var category = req.body.category;
  var body = req.body.body;
  var author = req.body.author;
  var date = new Date();

  var mainimage = '';

  /*if(req.file) {
    console.log('--> adding image');
      var mainimageOriginalName     = req.files.mainimage.originalname;
      mainimageName             = req.files.mainimage.name;
      var mainimageMime             = req.files.mainimage.mimetype;
      var mainimagePath             = req.files.mainimage.path;
      var mainimageExt              = req.files.mainimage.extension;
      var mainimageSize             = req.files.mainimage.size;
    } else {
      console.log('--> default no image');
      mainimageName = 'noimage.jpg';
    }*/

  // form validation
  req.checkBody('title', 'title field is required').notEmpty();
  req.checkBody('body', 'body field is required').notEmpty();


  var errors = req.validationErrors();

  if (errors) {
    console.log('--> ERRORS !!');
    res.render('addpost', {
      'errors': errors,
      'title': title,
      'body': body,
      'categories': categories
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
      'mainimage': mainimageName
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
