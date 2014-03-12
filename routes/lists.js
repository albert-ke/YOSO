var data = require('../data.json');
var lists = require('../lists.json');

exports.test = function(req, res) {
	res.json(lists);
}

exports.addItem = function(req, res) {
	var name = req.params.name;
	console.log("reached addItem...", name);
	var newitem = {
									"name": name,
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
	for (i = 0; i < lists["contents"].length; i++) {
		console.log(i, lists["contents"][i]["name"], "!");
		if (lists["contents"][i]["name"] in itemstodelete) {
			console.log("delete name", lists["contents"][i]["name"]);
			lists["contents"].splice(i, 1);
			i--;
		}
	}
	res.json(lists);
}

exports.completeItem = function(req, res) {
	itemstodelete = req.body;
	console.log(itemstodelete);
	
	console.log("1", lists["contents"]);
	for (i = 0; i < lists["contents"].length; i++) {
		//console.log(i, lists["contents"][i]["name"], "!");
		if (lists["contents"][i]["name"] in itemstodelete) {
			console.log("delete name", lists["contents"][i]["name"]);
			lists["contents"][i]["status"] = "done";
		}
	}

	console.log("2", lists["contents"]);
	res.json(lists);
}

exports.undoItem = function(req, res) {
	itemstodelete = req.body;
	console.log(itemstodelete);
	
	console.log("1", lists["contents"]);
	for (i = 0; i < lists["contents"].length; i++) {
		//console.log(i, lists["contents"][i]["name"], "!");
		if (lists["contents"][i]["name"] in itemstodelete) {
			console.log("delete name", lists["contents"][i]["name"]);
			lists["contents"][i]["status"] = "todo";
		}
	}

	console.log("2", lists["contents"]);
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

