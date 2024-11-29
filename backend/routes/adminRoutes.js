const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  viewUsers,
  deleteUser,
  viewAdmins,
  deleteAdmin,
  registerSuperAdmin,
  loginSuperAdmin
  
} = require('../controllers/adminControllers');
const verifyAdmin = require('../utils/verifyAdmin');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/super-register', registerSuperAdmin);
router.post('/super-login', loginSuperAdmin);
router.get('/view/users', verifyAdmin, viewUsers);
router.post('/delete/user', verifyAdmin, deleteUser);
router.get('/view-admin', verifyAdmin, viewAdmins);
router.post('/delete-admin', verifyAdmin, deleteAdmin);

module.exports = router;
