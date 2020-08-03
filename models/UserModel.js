const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please enter your firstname'],
  },
  lastname: {
    type: String,
    required: [true, 'Please enter your lastname'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email address'],
  },
  username: {
    type: String,
    required: [true, 'Please enter your username'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  passwordConfirm: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'librarian', 'head-librarian'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
