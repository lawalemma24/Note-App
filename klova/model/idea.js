const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  createdBy: {
    type: String,
    required: [true, 'Creator name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'approved', 'archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index to optimize queries by status and creation date
ideaSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Idea', ideaSchema);