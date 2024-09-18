const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserDetails, forgotPassword, resetPassword, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Logout User
router.get('/logout',isAuthenticatedUser, logoutUser);

// Get User Details
router.get('/me',isAuthenticatedUser, getUserDetails);

// Forgot Password
router.post('/forgotpassword', forgotPassword);

// Reset Password
router.post('/resetpassword/:token', resetPassword);

// Update Password
router.put('/updateprofile',isAuthenticatedUser, updateProfile);

// ADMIN DASHBOARD
router.get('/admin/users',isAuthenticatedUser, getAllUsers);
router.get('/admin/users/:id', getSingleUser);
router.patch('/admin/users/:id', updateUserRole);
router.delete('/admin/users/:id', deleteUser);

// Route to check if user is authenticated
router.get('/check-auth', isAuthenticatedUser, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

// Route to check if user is an admin
router.get('/check-admin', isAuthenticatedUser, (req, res) => {
    res.status(200).json({ success: true, role: req.user.role });
});



module.exports = router;