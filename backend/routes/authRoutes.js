const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authControllers');

// Register Route for Users
router.post('/register', register);

// Login Route for Users
router.post('/login', login);

module.exports = router;
