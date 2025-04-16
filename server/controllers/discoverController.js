const Lookbook = require('../models/Lookbook');

// Get trending lookbooks
exports.getTrending = async (req, res) => {
  try {
    // Get lookbooks with most likes in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const trendingLookbooks = await Lookbook.find({
      createdAt: { $gte: oneWeekAgo }
    })
      .sort({ 'likes.length': -1 })
      .limit(10)
      .populate('creator', 'username profilePicture');
    
    res.json(trendingLookbooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recommended lookbooks
exports.getRecommended = async (req, res) => {
  try {
    const user = req.user;
    
    // Get lookbooks from users the current user follows
    const recommendedLookbooks = await Lookbook.find({
      creator: { $in: user.following }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('creator', 'username profilePicture');
    
    res.json(recommendedLookbooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search lookbooks
exports.search = async (req, res) => {
  try {
    const { q, theme, season, occasion } = req.query;
    
    const query = {};
    
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    if (theme) query.theme = theme;
    if (season) query.season = season;
    if (occasion) query.occasion = occasion;
    
    const lookbooks = await Lookbook.find(query)
      .populate('creator', 'username profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(lookbooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};