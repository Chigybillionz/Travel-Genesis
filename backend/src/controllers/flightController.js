const flightService = require('../services/flightService');

// @desc    Search flights with query parameters
// @route   GET /api/flights/search
// @access  Public
const searchFlights = async (req, res, next) => {
  try {
    const { from, to, date, flightClass, minPrice, maxPrice, airline } = req.query;

    const flights = await flightService.searchFlights({
      from,
      to,
      date,
      flightClass,
      minPrice,
      maxPrice,
      airline,
    });

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all flights
// @route   GET /api/flights
// @access  Public
const getAllFlights = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const flights = await flightService.getAllFlights(limit);

    res.status(200).json({
      success: true,
      count: flights.length,
      data: flights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single flight by ID
// @route   GET /api/flights/:id
// @access  Public
const getFlightById = async (req, res, next) => {
  try {
    const flight = await flightService.getFlightById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found',
      });
    }

    res.status(200).json({
      success: true,
      data: flight,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchFlights,
  getAllFlights,
  getFlightById,
};
