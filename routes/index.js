var express = require('express');
var router = express.Router();
var User = require('../models/user-model');
var Note = require('../models/note-model');

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({},(err,users)=>{
    res.render('index', { users:users });
  }) 
});

router.get('/new', (req,res,next)=>{
  res.render('./notes/new');
})

router.post('/new', (req,res,next)=>{
  var title = req.body.title;
  var text = req.body.text;
  console.log(title,text);
  res.redirect('/new');
})

module.exports = router;
