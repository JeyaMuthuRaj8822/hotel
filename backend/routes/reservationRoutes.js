const express = require('express');
const router = express.Router();
const { bookRoom, viewReservation, viewHistory } = require('../controllers/reservationControllers');

const verifyUser = require('../utils/verifyUser');
const verifyAdmin = require('../utils/verifyAdmin');

// Route to book a room
router.post('/booking', verifyUser ,bookRoom);

// Route to see the user reservation data (for admins)
router.post('/view-reservation', verifyAdmin, viewReservation);

// Route to see the user reservation data (for users)
router.get('/view-history', verifyUser, viewHistory);

module.exports = router;
