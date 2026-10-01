const Flight = require('../models/Flight');

const searchFlights = async ({ from, to, date, flightClass, minPrice, maxPrice, airline }) => {
  const query = {};

  if (from) {
    // Match either airport code (e.g. LOS) or city name (e.g. Lagos)
    query.$or = [
      { 'origin.code': new RegExp(`^${from.trim()}$`, 'i') },
      { 'origin.city': new RegExp(from.trim(), 'i') },
    ];
  }

  if (to) {
    const toQuery = [
      { 'destination.code': new RegExp(`^${to.trim()}$`, 'i') },
      { 'destination.city': new RegExp(to.trim(), 'i') },
    ];
    if (query.$or) {
      query.$and = [
        { $or: query.$or },
        { $or: toQuery },
      ];
      delete query.$or;
    } else {
      query.$or = toQuery;
    }
  }

  if (flightClass) {
    query.flightClass = new RegExp(`^${flightClass.trim()}$`, 'i');
  }

  if (airline) {
    query.airline = new RegExp(airline.trim(), 'i');
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (date) {
    const searchDate = new Date(date);
    if (!isNaN(searchDate.getTime())) {
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      query.departureTime = { $gte: startOfDay, $lte: endOfDay };
    }
  }

  return await Flight.find(query).sort({ departureTime: 1 });
};

const getFlightById = async (id) => {
  return await Flight.findById(id);
};

const getAllFlights = async (limit = 20) => {
  return await Flight.find().limit(limit).sort({ createdAt: -1 });
};

module.exports = {
  searchFlights,
  getFlightById,
  getAllFlights,
};
