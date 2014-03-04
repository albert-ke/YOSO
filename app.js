
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator')
  , handlebars = require('express3-handlebars')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongodb = require('mongodb')
  , mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10
  , models = require('./models');

var index = require('./routes/index')
  , lists = require('./routes/lists');
  // , friends = require('./routes/friends');


mongoose.connect('localhost', 'test-yoso2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
//
//   Both serializer and deserializer edited for Remember Me functionality
passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    models.User.findOne( { accessToken: token }, function (err, existingUser) {
      if (err) { return done( err ); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
        user.set('accessToken', token);
        user.save( function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };

  if ( user._id ) {
    createAccessToken();
  }
});

passport.deserializeUser(function(token, done) {
  models.User.findOne( {accessToken: token } , function (err, user) {
    done(err, user);
  });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy( {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
  models.User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + email}); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(expressValidator());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Remember Me middleware
app.use( function (req, res, next) {
  if ( req.method == 'POST' && req.url == '/login' ) {
    if ( req.body.rememberme ) {
      req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
    } else {
      req.session.cookie.expires = false;
    }
  }
  next();
});

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(__dirname + '/../../public'));

// Add routes here
app.get('/', index.view);
app.get('/tab', index.tab);

app.get('/lists/test', lists.test);
app.post('/items/delete/', lists.deleteItem);
app.get('/items/update/:oldname/:newname', lists.update);
app.get('/items/add/', lists.addItem);

app.get('/lists/all', lists.listAll);
app.get('/list/edit/listAdd', lists.listAdd);
app.get('/list/edit/listDelete/:list', lists.listDelete);

app.get('/list/contents/:list', lists.listContents);
app.get('/list/edit/itemAdd/:list', lists.itemAdd);
app.get('/list/edit/itemDelete/:list/:item', lists.itemDelete);

// app.get('/friends/all', friends.listAll);
//app.get('/friends/edit/friendAdd', friends.friendAdd);
//app.get('/friends/edit/friendDelete/:firstname/:lastname', friends.friendDelete);


app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages });
});

app.get('/signup', function(req, res){
  res.render('signup', { user: req.user, message: req.session.messages });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
app.post('/login', function(req, res, next) {
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
        if (err) { return next(err); }
        return res.redirect('/');
        //return app.get('/', index.view);
      });
    })(req, res, next);
  }

  else {
    return res.render('login', errors[0]);
  }
});

app.post('/signup', function(req, res, next) {

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
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}