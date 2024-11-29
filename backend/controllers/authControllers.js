const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Regex to validate Gmail addresses
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  try {
    // Check if the email is a valid Gmail address
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ message: "Please use a valid Gmail address." });
    }

    // Check if the username or email already exists
    const ExistingUser = await User.findOne({ username });
    const ExistingEmail = await User.findOne({ email });
    if (ExistingEmail || ExistingUser) {
      return res.status(400).json({ message: "Existing username or email!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User has been created." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
};


// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isMatch= await bcrypt.compare(password,user.password);
    if (!isMatch){
      return res.status(400).json({ message: "Invalid or Incorrect Password" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET
    );
    res.setHeader('token', token);
    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Occurred" });
  }
};
//