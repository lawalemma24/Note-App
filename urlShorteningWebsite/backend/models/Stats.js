const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  urlPath: {
    type: String,
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  referrer: String,
  accessedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Stat', statSchema);