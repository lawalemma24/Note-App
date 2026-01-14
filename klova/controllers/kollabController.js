const Kollab = require('../model/kollab.js');
const Idea = require('../model/idea.js');
const Discussion = require('../model/discussion.js');


exports.createKollab = async (req, res) => {
  try {
    const { ideaId, goal, participants, successCriteria } = req.body;
    
    if (!ideaId || !goal || !participants || !successCriteria) {
      return res.status(400).json({ 
        error: 'ideaId, goal, participants, and successCriteria are required' 
      });
    }
    
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ 
        error: 'Participants must be a non-empty array' 
      });
    }
    
    const kollab = new Kollab({
      ideaId,
      goal,
      participants,
      successCriteria,
      status: 'active'
    });
    
    await kollab.save();
    
    res.status(201).json({
      message: 'Kollab created successfully',
      data: kollab
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'This idea already has an active Kollab' 
      });
    }
    
    res.status(400).json({ 
      error: error.message || 'Failed to create Kollab' 
    });
  }
};


exports.getKollab = async (req, res) => {
  try {
    const kollab = await Kollab.findById(req.params.id)
      .populate('ideaId', 'title description createdBy')
      .lean();
    
    if (!kollab) {
      return res.status(404).json({ error: 'Kollab not found' });
    }
    
     const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const discussions = await Discussion.find({ kollabId: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const totalDiscussions = await Discussion.countDocuments({ 
      kollabId: req.params.id 
    });
    
    res.json({
      ...kollab,
      discussions: {
        data: discussions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalDiscussions,
          pages: Math.ceil(totalDiscussions / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Failed to fetch Kollab' 
    });
  }
};