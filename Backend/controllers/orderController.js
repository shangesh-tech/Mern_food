const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create New Order
exports.newOrder = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            totalPrice,
        } = req.body;

        const orderExist = await Order.findOne({ paymentInfo });

        if (orderExist) {
            return res.status(400).json({
                success: false,
                message: "Order Already Placed",
            });
        }

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            totalPrice,
            paidAt: Date.now(),
            userID: req.user._id,
        });

        const msg = {
            to: req.user.email,
            from: process.env.SENDGRID_MAIL,
            templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
            dynamic_template_data: {
                name: req.user.name,
                shippingInfo,
                orderItems,
                totalPrice,
                oid: order._id,
            },
        };
        sgMail.send(msg).then(() => {
            console.log('Email Sent');
        }).catch((error) => {
            console.error('Error sending email:', error);
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Single Order Details
exports.getSingleOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("userID", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found",
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Logged In User Orders
exports.myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userID: req.user._id });

        if (!orders) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found",
            });
        }

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Orders ---ADMIN
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userID', 'name email');  // Populating user info

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No Orders Found",
            });
        }

        let totalAmount = 0;
        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        });

        res.status(200).json({
            success: true,
            orders,
            totalAmount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Order Status ---ADMIN
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({ success: false, message: "Order already delivered" });
        }

        // Update order status
        order.orderStatus = req.body.status;

        // Update shipped status and stock
        if (req.body.status === "Shipped") {
            order.shippedAt = Date.now();
        }

        // Update delivered status
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete Order ---ADMIN
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order Not Found",
            });
        }

        await order.remove();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
