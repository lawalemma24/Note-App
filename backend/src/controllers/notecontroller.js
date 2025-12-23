import Note from '../models/schema.js';

// Get all notes with filtering
export const getAllNotes = async (req, res) => {
  try {
    const { search, tag, favorite, archived } = req.query;
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) query.tags = tag;
    if (favorite !== undefined) query.favorite = favorite === 'true';
    if (archived !== undefined) query.archived = archived === 'true';
    
    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Get note by ID
export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

// Create new note
// ✅ CORRECT - Remove next parameter and handle response directly
export const createNote = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Request body:', req.body);

    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { title, content, tags, color } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    }

    // Prepare note data
    const noteData = {
      title: title.trim(),
      content: content.trim(),
    };

    // Only add optional fields if they are provided and valid
    if (tags) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array' });
      }
      noteData.tags = tags;
    }

    if (color) {
      if (typeof color !== 'string') {
        return res.status(400).json({ error: 'Color must be a string' });
      }
      noteData.color = color;
    }

    const note = new Note(noteData);
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // Handle duplicate key errors (if any unique index is set)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate note title' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove any fields that shouldn't be updated
    delete updates._id;
    delete updates.createdAt;
    
    const note = await Note.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Notes not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Error updating notes', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors 
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ 
      message: 'Note deleted successfully',
      id: note._id 
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
};

// Toggle favorite (NO JSON body expected)
export const toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    note.favorite = !note.favorite;
    note.updatedAt = Date.now();
    await note.save();
    
    res.json({
      ...note.toObject(),
      message: note.favorite ? 'Note favorited' : 'Note unfavorited'
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite status' });
  }
};

// Toggle archive (NO JSON body expected)
export const toggleArchive = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    note.archived = !note.archived;
    note.updatedAt = Date.now();
    await note.save();
    
    res.json({
      ...note.toObject(),
      message: note.archived ? 'Note archived' : 'Note unarchived'
    });
  } catch (error) {
    console.error('Error toggling archive:', error);
    res.status(500).json({ error: 'Failed to toggle archive status' });
  }
};

// Get statistics
export const getStatistics = async (req, res) => {
  try {
    const [totalNotes, favorites, archived, notes] = await Promise.all([
      Note.countDocuments(),
      Note.countDocuments({ favorite: true }),
      Note.countDocuments({ archived: true }),
      Note.find()
    ]);
    
    const totalWords = notes.reduce((sum, note) => {
      return sum + (note.content?.split(/\s+/).filter(word => word.length > 0).length || 0);
    }, 0);
    
    const allTags = notes.flatMap(note => note.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    // Get streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const streakToday = await Note.countDocuments({ createdAt: { $gte: today } });
    const streakYesterday = await Note.countDocuments({ 
      createdAt: { $gte: yesterday, $lt: today } 
    });
    
    const streak = streakToday > 0 ? 2 : (streakYesterday > 0 ? 1 : 0);
    
    res.json({
      totalNotes,
      totalWords,
      favorites,
      archived,
      categories: uniqueTags.length,
      streak,
      weeklyGrowth: Math.round((totalNotes / 7) * 100) / 100, // Average per day * 7
      collaborators: 1
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get tag statistics
export const getTagStatistics = async (req, res) => {
  try {
    const notes = await Note.find();
    const tagCount = {};
    
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        }
      });
    });
    
    // Convert to array for easier frontend consumption
    const tagArray = Object.entries(tagCount).map(([tag, count]) => ({
      tag,
      count
    })).sort((a, b) => b.count - a.count);
    
    res.json(tagArray);
  } catch (error) {
    console.error('Error fetching tag statistics:', error);
    res.status(500).json({ error: 'Failed to fetch tag statistics' });
  }
};

// Get recent activity
export const getActivity = async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 }).limit(10);
    const activity = notes.map(note => ({
      action: note.updatedAt.getTime() - note.createdAt.getTime() < 60000 ? 'created' : 'updated',
      target: note.title,
      user: 'System',
      time: note.updatedAt,
      noteId: note._id
    }));
    
    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

// Get detailed statistics
export const getDetailedStatistics = async (req, res) => {
  try {
    const notes = await Note.find();
    
    // Calculate daily activity for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyActivity = {};
    notes.forEach(note => {
      if (note.createdAt > thirtyDaysAgo) {
        const date = note.createdAt.toISOString().split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
      }
    });
    
    // Convert to array for charting
    const dailyActivityArray = Object.entries(dailyActivity)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate average note length
    const totalWords = notes.reduce((sum, note) => 
      sum + (note.content?.split(/\s+/).filter(word => word.length > 0).length || 0), 0);
    const avgNoteLength = notes.length > 0 ? totalWords / notes.length : 0;
    
    // Most productive day of week
    const dayCount = {};
    notes.forEach(note => {
      const day = note.createdAt.toLocaleDateString('en-US', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    
    const mostProductiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0];
    
    // Tag frequency
    const tagFrequency = {};
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        }
      });
    });
    
    const tagFrequencyArray = Object.entries(tagFrequency)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      dailyActivity: dailyActivityArray,
      avgNoteLength: Math.round(avgNoteLength * 10) / 10, // One decimal place
      mostProductiveDay: mostProductiveDay ? {
        day: mostProductiveDay[0],
        count: mostProductiveDay[1]
      } : { day: 'N/A', count: 0 },
      tagFrequency: tagFrequencyArray,
      totalNotes: notes.length,
      last30DaysNotes: dailyActivityArray.reduce((sum, day) => sum + day.count, 0),
      averageNotesPerDay: Math.round((notes.length / 30) * 10) / 10
    });
  } catch (error) {
    console.error('Error fetching detailed statistics:', error);
    res.status(500).json({ error: 'Failed to fetch detailed statistics' });
  }
};





//  import express from 'express';
//  import Note from '../models/schema.js';
 
//  export async function getAllNotes  (req, res)  {
//   try {
//     const notes = await Note.find().sort({ createdAt: -1 });
//     res.status(200).json(notes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// }

// export async function createNote  (req, res)  {
//   try {
//     const { title, content } = req.body;
//     const newNote = new Note({ title, content });
//     const savedNote = await newNote.save();
//     res.status(201).json({ message: 'Note created successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export async function updateNote  (req, res)  {
//   try {
//   const { title, content } = req.body;
//   const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
//   if (!updatedNote) {
//     return res.status(404).json({ message: 'Note not found' });
//   }
//   res.status(200).json(updatedNote);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// }
 

// export async function deleteNote  (req, res)  {
//   try {
//     const deletedNote = await Note.findByIdAndDelete(req.params.id);
//     if (!deletedNote) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
//     res.status(200).json({ message: 'Note deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

// export async function getAllNotesById (req, res)  {
//   try {
//     const note =  await Note.findById(req.params.id);
//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }
//     res.status(200).json(note);
//   } catch (error) {
//     res.status(500).json({ message:"Note not found" });
//   }
// }