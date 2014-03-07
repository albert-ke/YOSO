var models = require('../models');
var mongoose = require('mongoose');



exports.search = function(req, res) {
// console.log(req);
  console.log(req.user);
  var search = req.params.search;
  console.log("in search in friends.js");
  console.log(req.params.search);
  var searchName = new RegExp('^'+search+'$', "i");
  // var search-email = new RegExp()
  models.User.findOne({ $or:[{'email': searchName}, {'name.first': searchName}]}).exec(renderSearch);


  function renderSearch(err, query) {
    if(err) console.log(err);
    res.json(query);
  } 
}

exports.display = function(req, res) {
  user = req.user;
  console.log("in friends.js");
  models.User
    .find({'_id': {$in: [user.friends]}}) //'email name.first name.last')
    .exec(renderFriends);
     // res.render('friends');

  function renderFriends(err, friends) {
    console.log(friends);
    if(err) console.log(err);
    //if (err) return handleError(err);
    //console.log(query.email)
    res.json(friends);
  } 
} 

exports.add = function(req, res) {
  user = req.user;
  console.log("adding friend to db");
  models.User.findOne({'email': req.params.email}, '_id', function(err, newFriend){
    models.User.findOne({'_id': user._id}, function(err, user){
      if (err) { return next(err); }
      user.friends.push(newFriend);
    });
  });
}
