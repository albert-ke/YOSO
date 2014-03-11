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
      if (err) return next(err);
      if (exists) {
        console.log('User already exists');
        return res.render('signup', {msg: "Email already exists. Please choose a different email."});
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
  req.assert('email', 'a valid email is required').len(6,64).isEmail();  //Validate email
  req.assert('password', 'a valid password of 6 to 20 characters is required').len(6, 20);
  var errors = req.validationErrors(); 

  if (!errors) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        req.session.messages = [info.message];
        console.log(req.session.messages);
        return res.render('login', {'msg': req.session.messages});
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  }

  else {
    console.log(errors[0]);
    return res.render('login', errors[0]);
  }
}