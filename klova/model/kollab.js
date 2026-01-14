const mongoose = require('mongoose');

const kollabSchema = new mongoose.Schema({
  ideaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
  
  },
  goal: {
    type: String,
    required: [true, 'Goal is required'],
    maxlength: [1000, 'Goal cannot exceed 1000 characters']
  },
  participants: [{
    type: String,
    trim: true,
    required: [true, 'At least one participant is required']
  }],
  successCriteria: {
    type: String,
    required: [true, 'Success criteria is required'],
    maxlength: [1000, 'Success criteria cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure only one active Kollab per Idea
kollabSchema.index({ ideaId: 1, status: 1 }, { 
  unique: true,
  partialFilterExpression: { status: 'active' }
});

// Pre-save hook to validate referenced Idea status
kollabSchema.pre('save', async function() {
  const Idea = mongoose.model('Idea');
  const idea = await Idea.findById(this.ideaId);
  
  if (!idea) {
    throw new Error('Referenced idea does not exist');
  }
  
  if (idea.status !== 'approved') {
    throw new Error('Cannot create Kollab for non-approved ideas');
  }
});

module.exports = mongoose.model('Kollab', kollabSchema);