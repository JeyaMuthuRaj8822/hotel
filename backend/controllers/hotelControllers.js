const Hotel = require('../models/hotel');

// Add a new hotel
exports.addHotel = async (req, res) => {
    const id = req.id;
    const role = req.role;

    // Check role authorization
    if (!['superAdmin', 'admin'].includes(role)) {
        console.log(role);
        return res.status(403).json({ message: "You are not authorised to add hotels" });
    }

    try {
        const { name, location, rating, description, facilities } = req.body;

        const newHotel = new Hotel({
            name,
            location,
            rating,
            description,
            facilities,
            adminId: id,
            created_at: Date.now(),
        });

        const savedHotel = await newHotel.save();
        res.status(201).json({ message: "Hotel added successfully", data: savedHotel });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// View all hotels (For Users)
exports.viewHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels", error: error.message });
    }
};

// View Hotel Details(For Admins)
exports.viewHotelDetails = async (req, res) => {
    const role = req.role;
    if (!['superAdmin', 'admin'].includes(role)) {
        console.log(role);
        return res.status(403).json({ message: "You are not allowed to altered to edit hotel details " });
    }
    try {
      const hotels = await Hotel.find({}, { _id: 1, name: 1, admin: 1 }).populate("adminId", "name location");
      res.status(200).json({ message: "All Hotels Fetched", hotels });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error Fetching Hotels", err });
    }
  };
  
// Edit Hotel Details(For Admins)
exports.editHotelDetails = async (req, res) => {
    const adminId = req.id;
    const id=req.body;
    const { name, location, rating, description, facilities } = req.body;
    const role = req.role;
    if (role !== 'superAdmin' && role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        id,
       { $set:{ name, location, rating, description, facilities, altered_at: Date.now() }},
        { new: true, runValidators: true }
      );
      if (!updatedHotel) {
        return res.status(404).json({ message: "Hotel not found or unauthorized" });
      }
      res.status(200).json({ message: "Hotel updated successfully", data: updatedHotel });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error Updating Hotel", err });
    }
  };
  