// Import required modules
const adminModel = require("../Models/admin.model.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const axios = require('axios');
// const artistModel = require("../Models/artist.model.js");
const songModel = require("../Models/songs.model.js");

// API endpoint to add a new song
const addSongApi = async (req, res) => {
    const { adminkey, name, artist, image, audioLink, openInAppLink, goToArtist } = req.body;

    try {
        // Validate admin using the provided secret key
        const validateAdmin = await adminModel.findOne({ secretKey: adminkey });
        if (!validateAdmin) {
            return res.status(401).json({ message: "Unauthorized Access 🤦‍♀️🥲🤦‍♂️" });
        }

        // Verify that the provided admin key is correct and the admin is registered
        const verifyAdminKey = validateAdmin.secretKey === adminkey;
        if (!verifyAdminKey || !validateAdmin.isRegistered) {
            return res.status(401).json({ message: "Invalid Admin Key" });
        }

        // Ensure all required fields are provided
        if (!name || !artist || !image || !audioLink || !openInAppLink || !goToArtist) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        // Create and save a new song document
        const song = new songModel({
            name,
            artist,
            image,
            audioLink,
            openInAppLink,
            goToArtist
        });
        await song.save();

        // Return a success response
        return res.status(201).json({ message: "Song added successfully" });

    } catch (error) {
        // Return an error response in case of failure
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// API endpoint to add a new artist
const addArtist = async (req, res) => {
    const { adminkey, name, artistId, image, biography, socialMedia } = req.body;
    try {
        // Validate admin using the provided secret key
        const validateAdmin = await adminModel.findOne({ secretKey: adminkey });
        if (!validateAdmin) {
            return res.status(401).json({ message: "Unauthorized Access 🤦‍♀️🥲🤦‍♂️" });
        }

        // Verify that the provided admin key is correct and the admin is registered
        const verifyAdminKey = validateAdmin.secretKey === adminkey;
        if (!verifyAdminKey || !validateAdmin.isRegistered) {
            return res.status(401).json({ message: "Unauthorized Access 🤦‍♀️🥲🤦‍♂️" });
        }

        // Ensure all required fields are provided
        if (!name || !artistId || !image || !socialMedia || !biography) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        // Format social media links and create a new artist document
        const socialMediaLinks = socialMedia.map(item => ({ link: item || "null" }));
        const artist = new artistModel({
            name,
            artistId,
            socialMedia: socialMediaLinks,
            image,
            biography: biography || "null"
        });

        // Save the new artist document
        await artist.save();

    } catch (error) {
        // Return an error response in case of failure
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// API endpoint to create a new admin
const adminCreate = async (req, res) => {
    const { adminEmail, name, password } = req.body;
    try {
        // Ensure all required fields are provided
        if (!adminEmail || !name || !password) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        // Check if an admin with the given email already exists
        const adminFind = await adminModel.findOne({ adminEmail: adminEmail });
        if (adminFind) {
            return res.status(409).send({
                response: {
                    adminEmail,
                    message: "Email already exists 🤔",
                },
            });
        }

        // Generate a one-time password (OTP) for registration
        const token = crypto.randomInt(100000, 1000000);
        const newAdmin = new adminModel({
            adminName: name,
            password,
            adminEmail,
            adminSignupOTP: token,
            adminSignupOTPExpires: Date.now() + 3600000, // OTP expires in 1 hour
        });
        await newAdmin.save();

        // Configure and send an email with the OTP to the new admin
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAILINGEMAIL,
                pass: process.env.MAILINGEMAILPASSWORD,
            },
        });
        const mailOptions = {
            to: adminEmail,
            from: process.env.MAILINGEMAIL,
            subject: 'Verification Admin',
            text: `You are receiving this email because you (or someone else) have requested to register as an admin.\n\n` +
                `Your OTP code is: ${token}\n\n` +
                `Please enter this code in the application to complete the verification process.\n\n` +
                `If you did not request this, please ignore this email.\n`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Reset link sent to your email' });

    } catch (error) {
        // Log and return an error response in case of failure
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// API endpoint to verify admin OTP and complete registration
const adminOTPVerify = async (req, res) => {
    const { adminEmail, otp } = req.body;
    try {
        // Find the admin by email
        const admin = await adminModel.findOne({ adminEmail });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the OTP has expired
        if (admin.adminSignupOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        // Verify the provided OTP
        if (admin.adminSignupOTP !== parseInt(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid, generate a unique 12-digit code
        const uniqueCode = crypto.randomBytes(6).toString('hex').toUpperCase(); // 12-character hexadecimal string

        // Update the admin document with the unique code and registration status
        admin.secretKey = uniqueCode;
        admin.isRegistered = true;
        admin.adminSignupOTP = null;
        admin.adminSignupOTPExpires = null;
        await admin.save();

        // Configure and send an email with the unique code to the admin
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAILINGEMAIL,
                pass: process.env.MAILINGEMAILPASSWORD,
            },
        });

        const mailOptions = {
            to: adminEmail,
            from: process.env.MAILINGEMAIL,
            subject: 'Your Unique Code',
            text: `Congratulations! Your admin registration is complete.\n\n` +
                `Your unique code is: ${uniqueCode}\n\n` +
                `Please keep this code safe as it may be required for future reference.\n\n` +
                `If you did not request this, please ignore this email.\n`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Admin registered successfully, unique code sent to your email' });

    } catch (error) {
        // Log and return an error response in case of failure
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Export the API endpoint functions
module.exports = { addSongApi, adminCreate, addArtist, adminOTPVerify };
