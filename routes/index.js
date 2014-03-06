var data = require('../data.json');
var lists = require('../lists.json');
var models = require('../models');


exports.view = function(req, res) {
	if (req.isAuthenticated()) res.render('list', lists);
  	else res.redirect('/login');
 	// var email = req.user;
  // console.log(email);
 	// if (req.isAuthenticated()) res.redirect('/friends');
  //  	else res.redirect('/login');
  	
};

exports.tab = function(req, res) {
console.log(data["tab"]);
	res.json(data["tab"]);
};
