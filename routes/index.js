var express = require('express');
var router = express.Router();
var User = require('../models/user-model');
var Note = require('../models/note-model');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  User.findById(req.user._id).populate('notes').exec((err,userNotes)=>{
    if(err){
      console.log(err);
    }else{
      console.log(userNotes);
      res.render('index', {user:userNotes});
    }
  })
});



router.get('/new',isLoggedIn, (req,res,next)=>{
  res.render('./notes/new');
})

router.post('/new',isLoggedIn, (req,res,next)=>{
  var title = req.body.title;
  var text = req.body.text;
  console.log("title: ", title);
  console.log("text: ",text);
  
  Note.create({title:title, text:text}, (err, newNote)=>{
    if(err){
      console.log(err);
    }else{
      User.findById(req.user._id, (err,user)=>{
        console.log(user);
        if(err){
          console.log(err);
        }else{
          user.notes.push(newNote);
          user.save(err=>console.log(err));
          User.findById(req.user._id).populate('notes').exec((err,userNotes)=>{
            if(err){
              console.log(err);
            }else{
              res.redirect('/');
            }
          })
        }
      })
    }
  })

})

router.get('/:id', (req,res,next)=>{
  Note.findById(req.params.id, (err,note)=>{
    console.log(note);
    if(err){
      console.log(err);
    }else{
      res.render('./notes/show', {note:note});
    }
  })
})

//middleware

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/users/login');
}

module.exports = router;
