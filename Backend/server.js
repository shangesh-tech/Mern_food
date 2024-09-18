const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const paymentRoute = require('./routes/paymentRoute');
const cookieParser = require('cookie-parser');



const app = express();
app.use(cookieParser());
// Middleware
app.use(cors({
  origin: 'https://mern-food-frontend-6ywd.onrender.com',
  credentials: true,
}));
app.use(express.json());

// Log responses
app.use((req, res, next) => {
  console.log(`Path: ${req.path} | Method: ${req.method}`);
  next();
});

// Routes
app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api', paymentRoute);


// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });
