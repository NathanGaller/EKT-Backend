const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  token: String,
  google: {
    id: String,
    token: String,
  },
  lastFreeReading: Date,
  tier: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free',
  },
  subscription: {
    id: String,
    purchaseToken: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;