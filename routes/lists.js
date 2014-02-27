var data = require('../data.json');
var lists = require('../lists.json');

exports.test = function(req, res) {
	res.json(lists);
}

exports.addItem = function(req, res) {
	console.log("reached addItem...");
	var newitem = {
									"name": "new",
									"creator": "You",
									"status": "todo",
									"priority": "yellow"
								};
	lists["contents"].push(newitem);
	console.log("new item is "); console.log(newitem);
	console.log("new lists looks like this"); console.log(lists);
	res.json(lists);
}

exports.update = function(req, res) {
	oldname = req.params.oldname;
	newname = req.params.newname;

	lists["contents"].forEach(function(item) {
		if (item["name"] == oldname) {
			item["name"] = newname;
		}
	});
	console.log(lists);
	res.json(lists);
}

exports.deleteItem = function(req, res) {
	itemstodelete = req.body;
console.log(itemstodelete);
console.log("cow");

	for (i = 0; i < lists["contents"].length; i++) {
		console.log(i, "!");
		if (lists["contents"][i]["name"] in itemstodelete) {
			console.log("name", lists["contents"][i]["name"]);
			console.log("before: ", lists["contents"])
			lists["contents"].splice(i, 1);
			console.log("after: ", lists["contents"])
		}
	}
/*
	lists["contents"].forEach(function(item) {
		if (items[item["name"]]) {
			console.log("deleting", items[item["name"]]);
			var index = lists["contents"].indexOf(item);
			lists["contents"].splice(index, index+1);
			console.log('index', index, "item", item);
		}
	});*/
console.log(lists);
console.log("moose");
	res.json(lists);
}

exports.listAdd = function(req, res) {
	name = req.query.name;
	description = req.query.description;
	newList = {
								"name": name,
								"description": description,
								"contents": {},
								"members": "Albert Ke"
						};

	data["lists"][name] = newList;

	data["tab"] = "lists";
	res.redirect('/');
};

exports.listAll = function(req, res) {
	res.json(data);
};

exports.listContents = function(req, res) {
	console.log(data);
	res.json(data["lists"][req.params.list]);
};

exports.listDelete = function(req, res) {
	name = req.params.list;
	delete data["lists"][name];

	data["tab"] = "lists";
	res.redirect('/');
};

exports.itemAdd = function(req, res) {
	list = req.params.list;
	name = req.query.name;
	quantity = req.query.quantity;
	newItem = {
								"name": name,
								"quantity": quantity,
								"complete": "todo"
				 		};

	data["lists"][list]["contents"][name] = newItem;

	data["tab"] = "lists";
	res.redirect('/');
};

exports.itemDelete = function(req, res) {
	console.log("itemDelete");
	list = req.params.list;
	item = req.params.item;
	delete data["lists"][list]["contents"][item];

	data["tab"] = "lists";
	res.redirect('/');
};

