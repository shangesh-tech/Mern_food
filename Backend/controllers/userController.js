const User = require("../models/userModel");
const sendToken = require("../middleware/sendToken");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Hash password before saving the user
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// Compare password
const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Generate password reset token
const getResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set the reset token
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return { resetToken, hashedResetToken, resetPasswordExpire };
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, gender, password } = req.body;
    if (!email || !name || !password || !gender) {
      return res.status(400).json({ error: "Please add all fields" });
    }
    if (
      !email.includes("@gmail") &&
      !email.includes("@yahoo") &&
      !email.includes("@outlook")
    ) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      gender,
      password: hashedPassword,
      gender,
    });
    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Email And Password" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await comparePassword(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logout User
exports.logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    const { resetToken, hashedResetToken, resetPasswordExpire } =
      getResetPasswordToken();

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = resetPasswordExpire;

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `https://${req.get(
      "host"
    )}/password/reset/${resetToken}`;

    // Send Email using SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_MAIL,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      dynamic_template_data: { reset_url: resetPasswordUrl },
    };

    sgMail
      .send(msg)
      .then(() =>
        res
          .status(200)
          .json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
          })
      )
      .catch(async (emailError) => {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).json({ success: false, message: emailError.message });
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid reset password token" });
    }

    const hashedPassword = await hashPassword(req.body.password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
  
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.gender = req.body.gender || user.gender
      
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
  
   
      const updatedUser = await user.save();
  

      res.status(200).json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        gender: updatedUser.gender
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// ADMIN DASHBOARD

// Get All Users --ADMIN
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single User Details --ADMIN
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: `User doesn't exist with id: ${req.params.id}`,
        });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Role --ADMIN
exports.updateUserRole = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User --ADMIN
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: `User doesn't exist with id: ${req.params.id}`,
        });
    }

    await user.remove();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
