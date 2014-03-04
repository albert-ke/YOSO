var data = require('../data.json');
var lists = require('../lists.json');

exports.view = function(req, res) {
	if (req.isAuthenticated()) res.render('list', lists);
  	else res.redirect('/login');
};

exports.tab = function(req, res) {
console.log(data["tab"]);
	res.json(data["tab"]);
};
