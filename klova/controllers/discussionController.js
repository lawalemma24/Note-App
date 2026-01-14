
const Discussion = require('../model/discussion');
const Kollab = require('../model/kollab');

exports.createDiscussion = async (req, res) => {
  try {
    const { message, author } = req.body;
    const { id: kollabId } = req.params;
    
    if (!message || !author) {
      return res.status(400).json({ 
        error: 'Message and author are required' 
      });
    }
    
  
    const kollab = await Kollab.findById(kollabId);
    if (!kollab) {
      return res.status(404).json({ error: 'Kollab not found' });
    }
    
    if (kollab.status !== 'active') {
      return res.status(400).json({ 
        error: 'Cannot add discussion to a non-active Kollab' 
      });
    }
    
    const discussion = new Discussion({
      kollabId,
      message,
      author
    });
    
    await discussion.save();
    
    res.status(201).json({
      message: 'Discussion added successfully',
      data: discussion
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Failed to add discussion' 
    });
  }
};