var models = require('../models');


exports.search = function(req, res) {
  // console.log(req);
  var search = req.params.search;
  console.log("in search in friends.js");
  console.log(req.params.search);
  models.User.findOne({ $or:[{'email': search}, {'name.first': search}]}).exec(afterQuery);

  function afterQuery(err, query) {
    console.log("hahasjdflfj");
    if(err) console.log(err);
    //console.log(query.email)
    res.json(query);
  } 
}

exports.display = function(req, res) {
  console.log("in friends.js");
  console.log(req);
  models.User.findOne({ $or:[{'email': search}, {'name.first': search}]}).exec(afterQuery);

  function afterQuery(err, query) {
    console.log("hahasjdflfj");
    if(err) console.log(err);
    //console.log(query.email)
    res.json(query);
  } 
} 
