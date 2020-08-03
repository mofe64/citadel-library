const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  book: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  complaint: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
