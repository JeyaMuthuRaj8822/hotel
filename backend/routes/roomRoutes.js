const express = require('express');
const router = express.Router();
const {
    addRoom,
    getAllRooms,
    getRoomsByHotelId,
    deleteRoom
} = require('../controllers/roomControllers');
const verifyAdmin = require('../utils/verifyAdmin');

// Route to create room data
router.post('/add', verifyAdmin, addRoom);

// Route to get all rooms
router.get('/list', getAllRooms);

// Route to get rooms by hotel ID
router.post('/show', getRoomsByHotelId);

// Route to edit room data
router.post('/delete', verifyAdmin, deleteRoom);

module.exports = router;
