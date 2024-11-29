const express = require('express');
const router = express.Router();
const verifyAdmin = require('../utils/verifyAdmin');
const { addHotel, viewHotels ,viewHotelDetails ,editHotelDetails} = require('../controllers/hotelControllers');

// Add a new hotel
router.post('/add', verifyAdmin, addHotel);

// View all hotels (For Users)
router.get('/view', viewHotels);

// View all hotels (For Admins)
router.get('/view-hoteldetails', verifyAdmin, viewHotelDetails);

//edit hotel details(For Users)
router.post('/edit-hoteldetails', verifyAdmin, editHotelDetails);


module.exports = router;
