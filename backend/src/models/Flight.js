const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    airline: {
      type: String,
      required: true,
      trim: true,
    },
    airlineLogo: {
      type: String,
      default: '',
    },
    origin: {
      code: { type: String, required: true, uppercase: true, trim: true },
      city: { type: String, required: true, trim: true },
      airport: { type: String, default: '' },
    },
    destination: {
      code: { type: String, required: true, uppercase: true, trim: true },
      city: { type: String, required: true, trim: true },
      airport: { type: String, default: '' },
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      default: '6h 30m',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    flightClass: {
      type: String,
      enum: ['Economy', 'Premium Economy', 'Business', 'First Class'],
      default: 'Economy',
    },
    availableSeats: {
      type: Number,
      default: 60,
    },
    stops: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
