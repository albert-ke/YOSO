var models = require('../models');
var mongoose = require('mongoose');



exports.search = function(req, res) {
  console.log("inside friends.search");
  var search = req.params.search;
  console.log("searching for " + search);
  var searchName = new RegExp('^'+search+'$', "i");
  // var search-email = new RegExp()
  models.User
    .find({ $or:[{'email': searchName}, {'name.first': searchName}, {'name.last': searchName}]})
    .where('_id').ne(req.user.id)
    .exec(renderSearch);


  function renderSearch(err, query) {
    if(err) console.log(err);
    res.json(query);
  } 
}

exports.display = function(req, res) {
  console.log("inside friends.display");
  models.User
    // .find({'_id': {$in: [user.friends]}}) //'email name.first name.last')
    // .exec(renderFriends);
     // res.render('friends');
    .findOne({'email': req.user.email})
    .populate('friends', 'name email')
    .exec(renderFriends);

  function renderFriends(err, user) {
    if(err) console.log(err);
    // res.json(friends);
    console.log("displaying " + user.friends);
    res.render('friends', user.friends);
  } 
} 

exports.display2 = function(req, res) {
  console.log("inside friends.display2");
  models.User
    .findOne({'email': req.user.email})
    .populate('friends', 'name email')
    .exec(renderFriends);

  function renderFriends(err, user) {
    if(err) console.log(err);
    // res.json(friends);
    console.log("displaying " + user.friends);
    res.json(user.friends);
  } 
}

exports.add = function(req, res) {
  console.log("inside friends.add");
  var email = req.params.email;
  // console.log("adding " + email + " to " + req.user.name.full +"'s friends list");
  // models.User.findOne({'email': req.params.email}, '_id', function(err, newFriend){
  //   models.User.findOne({'_id': user._id}, function(err, user){
  //     if (err) { return next(err); }
  //     user.friends.push(newFriend);
  //   });
  // });
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
      // console.log(newUser);
      // console.log("updated friends list: " + req.user.friends);
      models.User
        .findByIdAndUpdate(req.user._id, {$push: {'friends': newId}})
        .exec(displayNewFriends);
    // models.User
    //   .findByIdAndUpdate(newId, {$push: {'friends': req.user._id}}, function(err, addFriend) {
    //     if(err) console.log(err);
    //   });
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
            // res.json(friends);
            console.log("displaying " + user.friends);
            res.json(user.friends);
          } 

        }
    // console.log(user.friends);
    
    } 
   }  
    
}


