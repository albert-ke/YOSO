var data = require('../data.json');
var lists = require('../lists.json');

exports.view = function(req, res) {
	res.render('list', lists);
};

exports.tab = function(req, res) {
console.log(data["tab"]);
	res.json(data["tab"]);
};
