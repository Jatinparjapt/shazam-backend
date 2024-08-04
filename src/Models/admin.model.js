const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Define the schema for the admin model
const adminSchema = new mongoose.Schema({
    // The name of the admin
    adminName: { type: String, required: true },
    
    // The hashed password of the admin
    password: { type: String, required: true },
    
    // The email of the admin, must be unique
    adminEmail: { type: String, required: true, unique: true },
    
    // The secret key for admin authentication, must be unique
    secretKey: { type: String, unique: true },
    
    // Indicates if the admin is registered or not
    isRegistered: { type: Boolean, default: false },
    
    // One-time password (OTP) for admin signup
    adminSignupOTP: { type: Number },
    
    // Expiration date for the signup OTP
    adminSignupOTPExpires: { type: Date }
}, {
    versionKey: false, // Disables the __v field that Mongoose adds by default
    timestamps: true   // Adds createdAt and updatedAt fields to the schema
});

// Pre-save hook to hash the password before saving the admin document
adminSchema.pre("save", async function(next) {
    // Check if the password field has been modified
    if (this.isModified("password")) {
        // Hash the password with a salt round of 12
        this.password = await bcryptjs.hash(this.password, 12);
    }
    next(); // Continue with the save operation
});

// Create and export the admin model
const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
