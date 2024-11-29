const Reservation = require('../models/reservation');
const Room = require('../models/room');
const Hotel = require('../models/hotel');

// Book a room
exports.bookRoom = async (req, res) => {
    try {
        const user_id = req.id;
        const username = req.username;
        const { hotel_id, room_no, vacate_date, people_count } = req.body;

        // Validate input
        if (!hotel_id || !room_no || !vacate_date || !people_count) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log('Received room_no:', room_no);  // Debugging room_no

        // Ensure room_no is a number
        const roomNoAsNumber = Number(room_no);
        console.log('Room No as Number:', roomNoAsNumber);  // Debugging room number conversion

        // Check room details
        const room = await Room.findOne({ hotelid: hotel_id, "rooms.roomNo": roomNoAsNumber });
        console.log('Room Document:', room);  // Debugging the room document retrieved

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find specific room details
        const roomDetails = room.rooms.find(r => r.roomNo === roomNoAsNumber);
        console.log('Room Details:', roomDetails);  // Debugging the roomDetails

        if (!roomDetails) {
            return res.status(404).json({ message: "Room details not found" });
        }

        if (!roomDetails.availability) {
            return res.status(400).json({ message: "Room is not available" });
        }

        if (people_count > roomDetails.maxPeople) {
            return res.status(400).json({ message: `Room cannot accommodate more than ${roomDetails.maxPeople} people` });
        }
        const id= hotel_id;
        const hotel= await Hotel.findById(id);
        console.log(hotel);
        
        // Create a new reservation
        const newReservation = new Reservation({
            user_id,
            username,
            hotel_id,
            hotel_name:hotel.name,
            room_no,
            vacate_date,
        });

        await newReservation.save();

        // Update room availability
        roomDetails.availability = false;

        // Save updated room document back to the database
        await room.save();

        res.status(201).json({ message: "Room booked successfully", data: newReservation });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

exports.viewReservation = async (req, res) => {
    const { userId } = req.body; // Extract userId from the request body

    if (!userId) {
        return res.status(400).json({ message: "User ID is not entered" });
    }

    try {
        const reservations = await Reservation.find({ user_id: userId }); // Use user_id field to query
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: "No Reservation Data is Found for this User ID" });
        }
        

        res.status(200).json({ message: "The user's reservation details were fetched", data: reservations });
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

exports.viewHistory = async (req, res) => {
    const  userId  = req.id; // Extract userId from the request body

    if (!userId) {
        return res.status(400).json({ message: "User ID is not entered" });
    }

    try {
        const reservations = await Reservation.find({ user_id: userId }); // Use user_id field to query
        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: "No Reservation Data is Found for this User ID" });
        }
        

        res.status(200).json({ message: "The user's reservation details were fetched", data: reservations });
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
