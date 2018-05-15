var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user-model');
//LocalStrategy = require('passport-local').Strategy,

/* GET users listing. */

// show registration form
router.get('/register', function(req, res, next) {
  res.render('register');
});

//Create a new user
router.post('/register', function(req, res, next) {
  var username = req.body.username;
  var newUser = new User({username:username});
  User.register(newUser, req.body.password, (err,user)=>{
    if(err){
      console.log(err);
    }else{
      passport.authenticate('local')(req,res, ()=>{
        res.redirect('/');
      })
    }
  })
});

//login route
router.get('/login',(req,res)=>{
  console.log("inside login route");
  res.render('login');
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/users/login'
  }),(req,res)=>{

})

//login route
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/users/login');
})

module.exports = router;
