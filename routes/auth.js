var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongodb = require('mongodb')
  , mongoose = require('mongoose')
  , models = require('../models');

exports.signup = function(req, res, next) {

  req.assert('firstname', 'first name is required').notEmpty();      //Validate 
  req.assert('lastname', 'last name is required').notEmpty();
  req.assert('email', 'a valid email is required').len(6,64).isEmail();  //Validate email
  req.assert('cpassword', 'passwords must match').equals(req.body.password);
  req.assert('password', 'a valid password of 6 to 20 characters is required').len(6, 20);
  var errors = req.validationErrors();  
    
  if (!errors) {   //Display errors to user
      // res.render('signup', { 
      //     title: 'Form Validation Example',
      //     message: '',
      //     errors: errors
      // });
    console.log("signup form passed validation");

    // check if user already exists
    models.User.findOne({ 'email': req.body.email}, function (err, exists){
      console.log("inside function")
      if (err) return next(err);
      if (exists) {
        console.log('User already exists');
        return res.redirect('/signup');
      }
      else {
        console.log('about to log user in');
        var user = new models.User({email: req.body.email, password: req.body.password, "name.first": req.body.firstname, "name.last": req.body.lastname});
        // save in Mongo
        user.save(function(err) {
          if(err) console.log(err);
          else {
           console.log('user: ' + user.email + " saved.");
            req.logIn(user, function(err) {
              if (err) console.log(err);
              return res.redirect('/');
            });
          } 
        });
      }
    });

  }  
  else {
    console.log(errors[0]);
    return res.render('signup', errors[0]);
  }   
}



exports.login = function(req, res, next) {
  req.assert('email', 'A valid email is required').len(6,64).isEmail();  //Validate email
  req.assert('password', 'A valid password of 6 to 20 characters required').len(6, 20);
  var errors = req.validationErrors(); 

  if (!errors) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        req.session.messages =  [info.message];
        return res.redirect('/login');
      }
      req.logIn(user, function(err) {
        //console.log(req.user.email);
        if (err) { return next(err); }
        return res.redirect('/');
        // return res.redirect('/');
        //console.log(user);
        // return res.render('friends', {'userID': user});
        // return app.get('/', index.view);
      });
    })(req, res, next);
  }

  else {
    return res.render('login', errors[0]);
  }
}