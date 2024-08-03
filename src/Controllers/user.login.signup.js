const userModel = require("../Models/user.model.js");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const loginUser = async (req, res) => {
  // email and password destructure
  const { email, password } = req.body;
  if (!password || !email ) {
    return res.status(400).json({ message: "All fields are mandatory" });
}
  try {
    const getUser = await userModel.findOne({ email });
    if (getUser) {
      const matchPassword = await bcryptjs.compare(password, getUser.password);
      if (matchPassword) {
        const tokenJwt = await getUser.generateAuthToken();
        return res
          .status(200)
          .json({
            message: "User Login Successfully 😎",
            token: tokenJwt,
            name: getUser.name,
          });
      }
    } else {
      return res.status(401).json({ error: "Invalid Credentials 🥲 " });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  if (!name || !password || !email ) {
    return res.status(400).json({ message: "All fields are mandatory" });
}
 try{
    
      const validateUserEmail = await userModel.findOne({ email });
      if (validateUserEmail) {
        return res.status(409).send({
          response: {
            email,
            message: "Email already exists 🤔",
          },
        });
      } else {
        const newUser = new userModel({
          name,
          email,
          password,
        });
        await newUser.save();
        return res.status(201).json({
          response: {
            message: "User Created Successfully 😎 ",
          },
        });
      }
 }catch(error){
  return res.status(500).json({ message: "Internal Server Error", error: error.message });
 }



};
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email ) {
    return res.status(400).json({ message: "All fields are mandatory" });
}
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found 🙄 " });
    }
    // Generate a token
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

  // Send email with reset link
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.MAILINGEMAIL,
          pass: process.env.MAILINGEMAILPASSWORD,
        },
      });

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
  
      await transporter.sendMail(mailOptions);
     return  res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({
            resetPasswordToken: req.params.otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        const { password } = req.body;
        if(!password){
            return res.status(400).json({ message: "All fields are mandatory" }); 
        }
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

       return res.status(200).json({ message: 'Password has been updated' });
    } catch (error) {
       return res.status(500).json({ message: 'Error on the server' });
    }
};




module.exports = { loginUser, registerUser, forgetPassword, resetPassword };
