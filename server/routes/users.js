const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  followUser,
  getUserById,
  saveLookbook,
  getSavedLookbooks
} = require('../controllers/userController');

const router = express.Router();

router.post('/:id/follow', protect, followUser);
router.get('/:id', getUserById);
router.post('/lookbooks/:id/save', protect, saveLookbook);
router.get('/saved/lookbooks', protect, getSavedLookbooks);

module.exports = router;