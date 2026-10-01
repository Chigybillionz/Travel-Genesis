const Destination = require('../models/Destination');

// @desc    Get explore / recommended destinations
// @route   GET /api/destinations/explore
// @access  Public
const getExploreDestinations = async (req, res, next) => {
  try {
    const { popular, tag, limit } = req.query;
    const filter = {};

    if (popular === 'true') {
      filter.isPopular = true;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    const maxResults = Number(limit) || 12;
    const destinations = await Destination.find(filter)
      .limit(maxResults)
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found',
      });
    }

    res.status(200).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExploreDestinations,
  getDestinationById,
};
