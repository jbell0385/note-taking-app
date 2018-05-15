var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user-model');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  console.log("inside '/' route");
  console.log(req.user);
  if(req.user !== undefined){
    User.findById(req.user._id).populate('notes').exec((err,userNotes)=>{
      if(err){
        console.log(err);
      }else{
        console.log("i'm in normal route");
        res.render('index', {user:userNotes});
      }
    })
  }else{
    var emptyNotes = [];
    console.log("I'm in alternative route");
    res.render('index', {user:emptyNotes});
  }
  
});





//middleware

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      console.log("User is authenticated.")
      return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
