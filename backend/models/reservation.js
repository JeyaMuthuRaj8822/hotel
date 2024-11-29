const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
    username:{type:String },
    hotel_id: { type: String },
    hotel_name:{type:String},
    room_no: { type: Number },
    price:{type:Number},
    booked_date: { type: Date ,default:Date.now() },
    vacate_date: { type: Date }
});

module.exports = mongoose.model("Reservation", ReservationSchema);
