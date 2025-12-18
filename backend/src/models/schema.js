import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true
  },
    category: { 
    type: String, 
    default: 'General',
    trim: true
  },
  content: { 
    type: String, 
    required: [true, 'Content is required'],
    trim: true
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  favorite: { 
    type: Boolean, 
    default: false 
  },
  archived: { 
    type: Boolean, 
    default: false 
  },
    isPublic: { 
    type: Boolean, 
    default: false 
  },
  color: { 
    type: String, 
    default: '#ffffff' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});



const Note = mongoose.model('Note', noteSchema);

export default Note;