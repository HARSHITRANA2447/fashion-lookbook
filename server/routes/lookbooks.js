const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createLookbook,
  getLookbooks,
  getLookbookById,
  updateLookbook,
  deleteLookbook,
  likeLookbook,
  commentLookbook
} = require('../controllers/lookbooks');

router.post('/', protect, createLookbook);
router.get('/', getLookbooks);
router.get('/:id', getLookbookById);
router.put('/:id', protect, updateLookbook);
router.delete('/:id', protect, deleteLookbook);
router.post('/:id/like', protect, likeLookbook);
router.post('/:id/comment', protect, commentLookbook);

module.exports = router;