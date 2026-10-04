const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Notification = require('../models/Notification');

const createBooking = async ({ userId, flightId, passengerName, passengerEmail, seatNumber, totalPrice }) => {
  let flight = null;
  if (flightId && mongoose.Types.ObjectId.isValid(flightId)) {
    flight = await Flight.findById(flightId);
  }
  if (!flight && flightId) {
    flight = await Flight.findOne({
      $or: [
        { flightNumber: new RegExp(`^${String(flightId).trim()}$`, 'i') },
        { 'destination.city': new RegExp(String(flightId).trim(), 'i') },
        { 'destination.code': new RegExp(`^${String(flightId).trim()}$`, 'i') },
      ],
    });
  }
  if (!flight) {
    flight = await Flight.findOne();
  }
  if (!flight) {
    const error = new Error('No flight available for booking');
    error.statusCode = 404;
    throw error;
  }

  // Generate unique booking reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const bookingReference = `TG-${flight.origin.code}${flight.destination.code}-${randomSuffix}`;

  const booking = await Booking.create({
    userId,
    flightId: flight._id,
    bookingReference,
    passengerName,
    passengerEmail,
    seatNumber: seatNumber || '14B',
    totalPrice: totalPrice || flight.price,
    status: 'Confirmed',
    paymentStatus: 'Paid',
  });

  // Task 5.3: Trigger Notification automatically
  try {
    await Notification.create({
      userId,
      title: 'Booking Confirmed! 🎉',
      message: `Your flight ${flight.flightNumber} (${flight.origin.city} ➔ ${flight.destination.city}) is confirmed for seat ${booking.seatNumber}. Reference: ${bookingReference}.`,
      type: 'booking',
    });
  } catch (notifErr) {
    console.error('Failed to trigger notification on booking:', notifErr.message);
  }

  return await booking.populate('flightId');
};

const getUserBookings = async (userId) => {
  return await Booking.find({ userId })
    .populate('flightId')
    .sort({ createdAt: -1 });
};

const getBookingById = async (id, userId) => {
  const booking = await Booking.findById(id).populate('flightId');
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (booking.userId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to access this booking');
    error.statusCode = 403;
    throw error;
  }

  return booking;
};

const cancelBooking = async (id, userId) => {
  const booking = await Booking.findById(id).populate('flightId');
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if (booking.userId.toString() !== userId.toString()) {
    const error = new Error('Not authorized to cancel this booking');
    error.statusCode = 403;
    throw error;
  }

  booking.status = 'Cancelled';
  await booking.save();

  // Task 5.3: Trigger cancellation notification
  try {
    const flightInfo = booking.flightId ? `${booking.flightId.flightNumber}` : 'flight';
    await Notification.create({
      userId,
      title: 'Booking Cancelled',
      message: `Your booking (${booking.bookingReference}) for ${flightInfo} has been cancelled successfully.`,
      type: 'booking',
    });
  } catch (notifErr) {
    console.error('Failed to trigger notification on cancellation:', notifErr.message);
  }

  return booking;
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
