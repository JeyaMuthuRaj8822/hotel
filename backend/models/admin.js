const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema({
    name: { type: String, unique:true},
    email: { type: String,  unique: true },
    password: { type: String },
    role: { type: String, enum: ["superAdmin", "admin"] },
});

module.exports = mongoose.model("Admin", AdminSchema);
