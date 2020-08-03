const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  bookAuthor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
