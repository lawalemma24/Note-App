const Url = require('../models/Url');
const Stat = require('../models/Stats.js');

// Get statistics for a URL
exports.getUrlStats = async (req, res) => {
  try {
    const { urlPath } = req.params;
    
    const url = await Url.findOne({ urlPath });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const stats = await Stat.find({ urlPath }).sort({ accessedAt: -1 }).limit(10);
    const totalClicks = url.clicks;

    // Get clicks by browser
    const browserStats = await Stat.aggregate([
      { $match: { urlPath } },
      { 
        $group: {
          _id: "$userAgent",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get clicks by hour of day
    const hourlyStats = await Stat.aggregate([
      { $match: { urlPath } },
      {
        $group: {
          _id: { $hour: "$accessedAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      urlPath,
      originalUrl: url.originalUrl,
      shortUrl: url.shortUrl,
      createdAt: url.createdAt,
      totalClicks,
      recentAccesses: stats,
      browserStats,
      hourlyStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};