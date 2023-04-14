const mongoose = require('mongoose');
const { Schema } = mongoose;

const TarotReadingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  reading: {
    type: String,
    required: true,
  },
  cards: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TarotReading = mongoose.model('TarotReading', TarotReadingSchema);

module.exports = TarotReading;
