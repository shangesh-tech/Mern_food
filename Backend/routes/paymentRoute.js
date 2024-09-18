const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();
const Order = require('../models/orderModel');
const { isAuthenticatedUser } = require('../middleware/auth');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', isAuthenticatedUser ,async (req, res) => {
  const { amount,shippingInfo, orderItems } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: 'inr',
      payment_method_types: ['card'], 
    });

   console.log(paymentIntent)
   if (paymentIntent.id){
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo: {
        id: paymentIntent.id, 
        status: 'Paid', 
      },
      totalPrice: amount,
      paidAt: Date.now(),
      userID: req.user._id, 
    })
    res.status(200).json({ message: 'Payment successful', order });
       
   }

    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
