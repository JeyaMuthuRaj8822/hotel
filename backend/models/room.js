const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    hotelid: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    rooms:[{
    roomNo:{type:Number},
    roomType: { type: String  },
    price: { type: Number },
    maxPeople:{type:Number },
    availability: { type: Boolean, default: true },
    amenities: [String]
    }],
    adminId:{ type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
});

module.exports = mongoose.model("Room", RoomSchema);
