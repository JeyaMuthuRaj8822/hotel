const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register Admin
exports.registerAdmin = async (req, res) => {
    
  const { name, email, password } = req.body;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  try {
    // Check if the email is a valid Gmail address
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ message: "Please use a valid Gmail address." });
    }
    
    const ExistingAdmin= await Admin.findOne({name});
    const ExistingEmail= await Admin.findOne({email});
    if(ExistingEmail||ExistingAdmin){
      return res.status(400).json({message:"Existing username or email !"})
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ name, email, password :hashedPassword, role:"admin"});
    await newAdmin.save();
    res.status(200).send("Admin has been created.");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }

    //check hashed password with input password
    const isMatch= await bcrypt.compare(password,admin.password);
    if (!isMatch){
      return res.status(400).json({ message: "Invalid or Incorrect Password" });
    }
    const token = jwt.sign(
      { id: admin._id, name: admin.name, role: admin.role },
      JWT_SECRET
    );
    res.setHeader('token', token);
    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Occurred", err });
  }
};

// Register Super-Admin
exports.registerSuperAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  try {
    // Check if the email is a valid Gmail address
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ message: "Please use a valid Gmail address." });
    }
    const ExistingAdmin= await Admin.findOne({name});
    const ExistingEmail= await Admin.findOne({email});
    if(ExistingEmail||ExistingAdmin){
      return res.status(400).json({message:"Existing username or email !"})
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ name, email, password:hashedPassword ,role:"superAdmin"});
    await newAdmin.save();
    res.status(200).send("Admin has been created.");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
};

// Login super Admin
exports.loginSuperAdmin = async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }
    // Check if the role is 'superAdmin'
    if (admin.role !== 'superAdmin') {
      return res.status(403).json({ message: "Access Denied: Not a SuperAdmin" });
    }
    //check hashed password with input password
    const isMatch= await bcrypt.compare(password,admin.password);
    if (!isMatch){
      return res.status(400).json({ message: "Invalid or Incorrect Password" });
    }
    const token = jwt.sign(
      { id: admin._id, name: admin.name, role: admin.role },
      JWT_SECRET
    );
    res.setHeader('token', token);
    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Occurred", err });
  }
};


// View All Users
exports.viewUsers = async (req, res) => {
  const role = req.role;
  if (role !== 'admin' && role !== 'superAdmin') {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  try {
    const users = await User.find({}, { _id: 1, username: 1 });
    res.status(200).json({ message: "All Users Fetched", users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Fetching Users", err });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const role = req.role;
  const { _id } = req.body;
  if (role !== 'admin' && role !== 'superAdmin') {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "The user is deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Deleting User", err });
  }
};

// View Admins
exports.viewAdmins = async (req, res) => {
  const role = req.role;
  if (role !== 'superAdmin') {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  try {
    const admins = await Admin.find({ role: "admin" }, { _id: 1, name: 1 });
    res.status(200).json({ message: "All Admins Fetched", admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Fetching Admins", err });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  const role = req.role;
  const { _id } = req.body;
  if (role !== 'superAdmin') {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  try {
    const admin = await Admin.findByIdAndDelete(_id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "The admin is deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Deleting Admin", err });
  }
};

