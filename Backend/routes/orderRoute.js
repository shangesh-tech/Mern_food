const express = require('express');
const { newOrder, getSingleOrderDetails, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Route for creating a new order
router.route('/order/new').post(isAuthenticatedUser, newOrder);

// Route for getting single order details
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrderDetails);

// Route for getting all orders for the current user
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

// Admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// Route for updating and deleting an order (admin only)
router.route('/admin/order/:id')
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;