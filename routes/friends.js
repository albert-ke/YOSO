var models = require('../models');
var mongoose = require('mongoose');



exports.search = function(req, res) {
  console.log("inside friends.search");
  console.log("user info: " + req.user);
  var search = req.params.search;
  console.log("searching for " + search);
  var searchName = new RegExp('^'+search+'$', "i");
  // var search-email = new RegExp()
  models.User
    .find({ $or:[{'email': searchName}, {'name.first': searchName}, {'name.last': searchName}]})
    .where('_id').ne(req.user.id)
    // .where('_id').ne(req.user.friends)
    .exec(renderSearch);


  function renderSearch(err, query) {
    if(err) console.log(err);
    res.json(query);
  } 
}


// exports.display = function(req, res) {
//   console.log("inside friends.display");
//   models.User

//     .findOne({'email': req.user.email})
//     .populate('friends', 'name email')
//     .exec(renderFriends);

//   function renderFriends(err, user) {
//     if(err) console.log(err);
//     console.log("displaying " + user.friends);
//     res.render('friends', user.friends);
//   } 
// } 

exports.display = function(req, res) {
  console.log("inside friends.display2");
  models.User
    .findOne({'email': req.user.email})
    .populate('friends', 'name email')
    .exec(renderFriends);

  function renderFriends(err, user) {
    if(err) console.log(err);
    console.log("displaying " + user.friends);
    res.json(user.friends);
  } 
}

exports.add = function(req, res) {
  console.log("inside friends.add");
  var email = req.params.email;

  models.User
    .findOne({'email': req.params.email})
    .exec(updateFriend);

  function updateFriend(err, newFriend) {
    console.log("adding " + newFriend.email + "to " + req.user.name.full +"'s friends list");
    if(err) console.log(err);
    var newId = newFriend._id; 

    models.User
      .findByIdAndUpdate(newId, {$push: {'friends': req.user._id}})
      .exec(updateUser);

    function updateUser(err, newFriend) {
      if(err) console.log(err);
      models.User
        .findByIdAndUpdate(req.user._id, {$push: {'friends': newId}})
        .exec(displayNewFriends);
 
        function displayNewFriends(err, user) {
          if(err) console.log(err);
          console.log("updated friends list to: " + user.friends);
          // display;
          // res.json(user.friends); 
          models.User
            .findOne({'email': req.user.email})
            .populate('friends', 'name email')
            .exec(renderFriends);

          function renderFriends(err, user) {
            if(err) console.log(err);
            console.log("displaying " + user.friends);
            res.json(user.friends);
          } 

        }
    
    } 
   }  
    
}


