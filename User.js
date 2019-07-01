const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: Number,
  date: String,
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  exercise: [exerciseSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
