const Room = require('../models/room');

// Create Room Data
exports.addRoom = async (req, res) => {
    const adminId = req.id;
    try {
        const { hotelid, rooms } = req.body;

        if (!hotelid || !rooms || !Array.isArray(rooms)) {
            return res.status(400).json({ message: "Invalid data provided" });
        }

        const newRoom = new Room({
            hotelid,
            rooms,
            adminId
        });

        const savedRoom = await newRoom.save();
        res.status(201).json({ message: "Room data added successfully", data: savedRoom });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Get All Rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate("hotelid", "name location");
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch rooms", message: error.message });
    }
};

// Get Rooms by Hotel ID
exports.getRoomsByHotelId = async (req, res) => {
    try {
        const { hotelid } = req.body;

        const room = await Room.find({ hotelid });
        if (!room.length) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Rooms successfully fetched!", room });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch the rooms", message: error.message });
    }
};

// Edit Room Data
exports.deleteRoom = async (req, res) => {
    const { hotelid } = req.body;
    //const adminId = req.id; // Assuming req.id is the authenticated admin's ID.

    try {
        // Validate hotelid
        if (!hotelid) {
            return res.status(400).json({ message: "Hotel ID is required" });
        }

        // Find and delete all rooms associated with the hotelid and adminId
        const room = await Room.findOneAndDelete({ hotelid: hotelid });
        console.log(room);
        // If no matching rooms found
        if (!room) {
            return res.status(404).json({ message: "No rooms found for the given hotel or unauthorized action" });
        }

        res.status(200).json({ 
            message: `room(s) deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
