const express = require('express');
const router = express.Router();
const {
  getExploreDestinations,
  getDestinationById,
} = require('../controllers/destinationController');

router.get('/explore', getExploreDestinations);
router.get('/:id', getDestinationById);

module.exports = router;
