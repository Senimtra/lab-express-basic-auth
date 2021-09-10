// ### Create user model ###
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name: {
      type: String
   },
   username: {
      type: String,
      required: true,
      trim: true
   },
   passwordHashAndSalt: {
      type: String,
      required: true
   }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
