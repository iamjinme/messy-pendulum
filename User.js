const { Schema, model } = require('mongoose');

const exerciseSchema = Schema({
  description: {
    type: String,
    required: true,
  },
  duration: Number,
  date: String,
});

const userSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  exercise: [exerciseSchema],
});

const User = model('User', userSchema);

module.exports = User;
