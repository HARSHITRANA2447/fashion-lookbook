const User = require('../models/User');
const Lookbook = require('../models/Lookbook');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }
    
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already following
    const alreadyFollowing = currentUser.following.includes(req.params.id);
    
    if (alreadyFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({
      following: alreadyFollowing ? false : true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'username profilePicture')
      .populate('following', 'username profilePicture');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's lookbooks
    const lookbooks = await Lookbook.find({ creator: req.params.id })
      .sort({ createdAt: -1 });
    
    res.json({
      user,
      lookbooks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save a lookbook
exports.saveLookbook = async (req, res) => {
  try {
    const lookbook = await Lookbook.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!lookbook) {
      return res.status(404).json({ message: 'Lookbook not found' });
    }
    
    // Check if already saved
    const alreadySaved = user.savedLookbooks.includes(req.params.id);
    
    if (alreadySaved) {
      // Unsave
      user.savedLookbooks = user.savedLookbooks.filter(
        id => id.toString() !== req.params.id
      );
    } else {
      // Save
      user.savedLookbooks.push(req.params.id);
    }
    
    await user.save();
    
    res.json({
      saved: alreadySaved ? false : true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get saved lookbooks
exports.getSavedLookbooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedLookbooks',
      populate: {
        path: 'creator',
        select: 'username profilePicture'
      }
    });
    
    res.json(user.savedLookbooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};