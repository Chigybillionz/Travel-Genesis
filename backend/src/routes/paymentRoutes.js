const express = require('express');
const router = express.Router();
const {
  initializePayment,
  verifyPayment
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

router.use(protect); // Ensure user is authenticated

router.post('/initialize', initializePayment);
router.get('/verify/:reference', verifyPayment);

module.exports = router;
