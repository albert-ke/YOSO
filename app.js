
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
  , auth = require('./routes/auth');

var index = require('./routes/index')
  , lists = require('./routes/lists')
  , friends = require('./routes/friends');



mongoose.connect('localhost', 'test-yoso2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

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

// app.get('/friends', function(req, res) {
//   console.log(req.user);
//   res.render('friends', req.user);
// });

app.get('/friends/:search', friends.search);
app.get('/friends', friends.display);
  // var search = req.params.search;
   // User.find({ 'email': search}
// });
// app.get('/friends', function(req, res){
//   res.render('friends', { user: req.user, message: req.session.messages });
// });
//app.get('/friends/edit/friendAdd', friends.friendAdd);
//app.get('/friends/edit/friendDelete/:firstname/:lastname', friends.friendDelete);


app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages });
});

app.get('/signup', function(req, res){
  //console.log(req.user);
  res.render('signup', { user: req.user, message: req.session.messages });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.post('/login', auth.login);

app.post('/signup', auth.signup);

require('./pass.js')(passport, LocalStrategy, db);
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