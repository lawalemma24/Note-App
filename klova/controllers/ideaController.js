const Idea = require('../model/idea.js');
const Kollab = require('../model/kollab.js');


exports.createIdea = async (req, res) => {
  try {
    const { title, description, createdBy, status = 'draft' } = req.body;
    
    if (!title || !description || !createdBy) {
      return res.status(400).json({ 
        error: 'Title, description, and createdBy are required' 
      });
    }
    // Create and save the new idea
    const idea = new Idea({
      title,
      description,
      createdBy,
      status
    });
    
    await idea.save();
    
    res.status(201).json({
      message: 'Idea created successfully',
      data: idea
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Failed to create idea' 
    });
  }
};


exports.listIdeas = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = {};
    if (status) {
      query.status = status;
    }

    // Fetch ideas with pagination
    const ideas = await Idea.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Idea.countDocuments(query);
    
    res.json({
      data: ideas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message || 'Failed to fetch ideas' 
    });
  }
};

exports.getIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id).lean();
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Check for an active Kollab associated with this idea
    const activeKollab = await Kollab.findOne({ 
      ideaId: req.params.id, 
      status: 'active' 
    }).select('goal status participants');
    
    res.json({
      ...idea,
      activeKollab: activeKollab || null
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Failed to fetch idea' 
    });
  }
};