var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

// User Schema
var userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  name: {
      first: { type: String, required: true, trim: true},
      last: { type: String, required: true, trim: true}
  },
  phone: Number,
  lists: [listSchema],
  friends: [mongoose.Types.ObjectId],
  accessToken: { type: String } // Used for Remember Me
});

userSchema.virtual('name.full').set(function (name) {
  var split = name.split(' ');
  this.name.first = split[0];
  this.name.last = split[1];
});

userSchema.virtual('name.full').get(function (name) {
  return this.name.first + ' ' + this.name.last;
});

var listSchema = new mongoose.Schema({
    name: String,
    description: String,
    contents: [contentSchema],
    created: {type: Date, default:Date.now}
});
var contentSchema = new mongoose.Schema({
    name: String,
    quantity: String,
    complete: Boolean
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

// Remember Me implementation helper method
userSchema.methods.generateRandomToken = function () {
  var user = this,
      chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
      token = new Date().getTime() + '_';
  for ( var x = 0; x < 16; x++ ) {
    var i = Math.floor( Math.random() * 62 );
    token += chars.charAt( i );
  }
  return token;
};

exports.User = mongoose.model('User', userSchema);

// Seed a user

// var usr = new User({ email: 'test7@gmail.com', password: 'password',  "name.first": 'yoso', "name.last": 'app'});
// usr.save(function(err) {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('user: ' + usr.name.full + " saved.");
//   }
// });
