const Lookbook = require('../models/Lookbook');
const User = require('../models/User');

// Create a new lookbook
exports.createLookbook = async (req, res) => {
  try {
    const { title, description, theme, season, occasion, tags, images } = req.body;

    // Create lookbook
    const lookbook = await Lookbook.create({
      title,
      description,
      creator: req.user._id,
      theme,
      season,
      occasion,
      tags,
      images
    });

    res.status(201).json(lookbook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all lookbooks
exports.getLookbooks = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    const count = await Lookbook.countDocuments();
    const lookbooks = await Lookbook.find()
      .populate('creator', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      lookbooks,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get lookbook by ID
exports.getLookbookById = async (req, res) => {
  try {
    const lookbook = await Lookbook.findById(req.params.id)
      .populate('creator', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');
    
    if (!lookbook) {
      return res.status(404).json({ message: 'Lookbook not found' });
    }

    res.status(200).json(lookbook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update lookbook
exports.updateLookbook = async (req, res) => {
  try {
    const { title, description, theme, season, occasion, tags, images } = req.body;

    const lookbook = await Lookbook.findById(req.params.id);
    
    if (!lookbook) {
      return res.status(404).json({ message: 'Lookbook not found' });
    }

    // Check if user is the creator
    if (lookbook.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update lookbook
    lookbook.title = title || lookbook.title;
    lookbook.description = description || lookbook.description;
    lookbook.theme = theme || lookbook.theme;
    lookbook.season = season || lookbook.season;
    lookbook.occasion = occasion || lookbook.occasion;
    lookbook.tags = tags || lookbook.tags;
    lookbook.images = images || lookbook.images;
    lookbook.updatedAt = Date.now();

    const updatedLookbook = await lookbook.save();
    
    res.status(200).json(updatedLookbook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete lookbook
exports.deleteLookbook = async (req, res) => {
  try {
    const lookbook = await Lookbook.findById(req.params.id);
    
    if (!lookbook) {
      return res.status(404).json({ message: 'Lookbook not found' });
    }

    // Check if user is the creator
    if (lookbook.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await lookbook.remove();
    
    res.status(200).json({ message: 'Lookbook removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Like lookbook
exports.likeLookbook = async (req, res) => {
  try {
    const lookbook = await Lookbook.findById(req.params.id);
    
    if (!lookbook) {
      return res.status(404).json({ message: 'Lookbook not found' });
    }

    // Check if lookbook has already been liked
    const alreadyLiked = lookbook.likes.find(
      (like) => like.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike
      lookbook.likes = lookbook.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      lookbook.likes.push(req.user._id);
    }

    await lookbook.save();
    
    res.status(200).json({ likes: lookbook.likes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add comment to lookbook
exports.commentLookbook = async (req, res) => {
  try {
    const { text } = req.body;
    
    const lookbook = await Lookbook.findById(req.params.id);
    
    if (!lookbook) {
      return res.status(404).json({ message: 'Lookbook not found' });
    }

    // Add comment
    const comment = {
      user: req.user._id,
      text,
      createdAt: Date.now()
    };

    lookbook.comments.push(comment);
    await lookbook.save();

    // Populate the user info for the new comment
    const populatedLookbook = await Lookbook.findById(req.params.id)
      .populate('comments.user', 'username profilePicture');
    
    res.status(201).json(populatedLookbook.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};