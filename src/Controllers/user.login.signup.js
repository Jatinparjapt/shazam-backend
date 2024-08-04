// Import required modules
const userModel = require("../Models/user.model.js");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// API endpoint for user login
const loginUser = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!password || !email) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    // Find the user by email
    const getUser = await userModel.findOne({ email });
    if (getUser) {
      // Compare the provided password with the stored hashed password
      const matchPassword = await bcryptjs.compare(password, getUser.password);
      if (matchPassword) {
        // Generate an authentication token for the user
        const tokenJwt = await getUser.generateAuthToken();
        return res.status(200).json({
          message: "User Login Successfully 😎",
          token: tokenJwt,
          name: getUser.name,
        });
      }
    } else {
      return res.status(401).json({ error: "Invalid Credentials 🥲" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// API endpoint for user registration
const registerUser = async (req, res) => {
  // Destructure email, password, and name from request body
  const { email, password, name } = req.body;

  // Check if all required fields are provided
  if (!name || !password || !email) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    // Check if the email is already registered
    const validateUserEmail = await userModel.findOne({ email });
    if (validateUserEmail) {
      return res.status(409).send({
        response: {
          email,
          message: "Email already exists 🤔",
        },
      });
    } else {
      // Create a new user and save to the database
      const newUser = new userModel({
        name,
        email,
        password,
      });
      await newUser.save();
      return res.status(201).json({
        response: {
          message: "User Created Successfully 😎",
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// API endpoint for handling forgotten passwords
const forgetPassword = async (req, res) => {
  // Destructure email from request body
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    // Find the user by email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found 🙄" });
    }

    // Generate a password reset token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAILINGEMAIL,
        pass: process.env.MAILINGEMAILPASSWORD,
      },
    });

    // Email options including reset link
    const mailOptions = {
      to: user.email,
      from: process.env.MAILINGEMAIL,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `Your OTP code is: ${token}\n\n` +
            `http://${req.headers.host}/reset-password/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // Send the reset link via email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// API endpoint for resetting the password
const resetPassword = async (req, res) => {
  try {
    // Find the user with a valid reset token that has not expired
    const user = await userModel.findOne({
      resetPasswordToken: req.params.otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Destructure new password from request body
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    // Clear the reset token and expiry date
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Update the user's password
    user.password = await bcryptjs.hash(password, 10); // Hash the new password
    await user.save();

    return res.status(200).json({ message: 'Password has been updated' });
  } catch (error) {
    return res.status(500).json({ message: 'Error on the server', error: error.message });
  }
};

// Export the API endpoint functions
module.exports = { loginUser, registerUser, forgetPassword, resetPassword };
