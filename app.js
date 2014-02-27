
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var lists = require('./routes/lists');
//var friends = require('./routes/friends');

// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

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

//app.get('/friends/all', friends.listAll);
//app.get('/friends/edit/friendAdd', friends.friendAdd);
//app.get('/friends/edit/friendDelete/:firstname/:lastname', friends.friendDelete);

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
