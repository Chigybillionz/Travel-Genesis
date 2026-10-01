const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyTrips,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');

router.use(protect); // All booking routes are protected

router.route('/')
  .post(createBooking);

router.get('/my-trips', getMyTrips);

router.route('/:id')
  .get(getBookingById);

router.patch('/:id/cancel', cancelBooking);

module.exports = router;
