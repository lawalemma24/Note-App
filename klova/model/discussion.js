const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  kollabId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kollab',
    required: [true, 'Kollab reference is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

discussionSchema.index({ kollabId: 1, createdAt: -1 });


// Pre-save hook to validate referenced Kollab status
discussionSchema.pre('save', async function() {
  const Kollab = mongoose.model('Kollab');
  const kollab = await Kollab.findById(this.kollabId);
  
  if (!kollab) {
    throw new Error('Kollab not found');
  }
});

module.exports = mongoose.model('Discussion', discussionSchema);