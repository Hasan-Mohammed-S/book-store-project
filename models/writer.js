const mongoose = require('mongoose');

const writerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://placeholder.com'
  },
  bio: {
    type: String,
    required: true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Writer', writerSchema);
