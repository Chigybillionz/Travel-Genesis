const bookingService = require('../services/bookingService');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { flightId, seatNumber, passengerName, passengerEmail, totalPrice } = req.body;

    if (!flightId) {
      return res.status(400).json({
        success: false,
        message: 'Flight ID is required to create a booking',
      });
    }

    const booking = await bookingService.createBooking({
      userId: req.user._id,
      flightId,
      seatNumber: seatNumber || '14B',
      passengerName: passengerName || req.user.name,
      passengerEmail: passengerEmail || req.user.email,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings / trips
// @route   GET /api/bookings/my-trips
// @access  Private
const getMyTrips = async (req, res, next) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyTrips,
  getBookingById,
  cancelBooking,
};
