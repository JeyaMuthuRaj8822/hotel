const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    name: { type: String },
    location: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String },
    facilities: [{ type: String }],
    created_at:{type:Date},
    altered_at:{type:Date},
    adminId:{ type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
});

module.exports = mongoose.model("Hotel", HotelSchema);
