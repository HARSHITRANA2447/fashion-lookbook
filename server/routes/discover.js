const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getTrending, getRecommended, search } = require('../controllers/discoverController');

const router = express.Router();

router.get('/trending', getTrending);
router.get('/recommended', protect, getRecommended);
router.get('/search', search);

module.exports = router;