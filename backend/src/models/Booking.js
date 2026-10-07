const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: true,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    passengerEmail: {
      type: String,
      required: true,
      trim: true,
    },
    seatNumber: {
      type: String,
      default: '14B',
      trim: true,
    },
    flightClass: {
      type: String,
      enum: ['Economy', 'Premium Economy', 'Business', 'First Class'],
      default: 'Economy',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Paid',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
