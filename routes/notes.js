var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user-model');
var Note = require('../models/note-model');


router.use( function( req, res, next ) {
    // this middleware will call for each requested
    // and we checked for the requested query properties
    // if _method was existed
    // then we know, clients need to call DELETE request instead
    if ( req.query._method == 'DELETE' ) {
        // change the original METHOD
        // into DELETE method
        req.method = 'DELETE';
        // and set requested url to /user/12
        req.url = req.path;
    }       
    next(); 
});

router.get('/new',isLoggedIn, (req,res,next)=>{
    res.render('./notes/new');
})
  
router.post('/new',isLoggedIn, (req,res,next)=>{
    var title = req.body.title;
    var text = req.body.text;

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
        if(err){
            console.log(err);
        }else{
            res.render('./notes/show', {note:note});
        }
    })
})

//show editing form
router.get('/:id/edit', (req,res,next)=>{
    Note.findById(req.params.id, (err,note)=>{
        if(err){
            console.log(err);
        }else{
            res.render('./notes/edit', {note:note});
        }
    })
})

//Process editing the note
router.put('/:id', (req,res,next)=>{
    req.body.title = req.sanitize(req.body.title);
    req.body.text = req.sanitize(req.body.text);
    Note.findByIdAndUpdate(req.params.id, {title:req.body.title, text:req.body.text} ,(err,note)=>{
        if(err){
            console.log(err);
            res.redirect('/notes/'+req.params.id+'/edit');
        }else{
            res.redirect('/');
        }
    })
})

router.delete('/:id', (req,res,next)=>{
    Note.findByIdAndRemove(req.params.id, (err,note)=>{
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    })
})

//middleware

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        console.log("User is authenticated.")
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;