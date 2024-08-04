const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Import jwt for generating authentication tokens

// Define the schema for the user model
const userSchema = new mongoose.Schema({
    // The name of the user
    name: { type: String, required: true },
    
    // The hashed password of the user
    password: { type: String, required: true },
    
    // The unique email of the user
    email: { type: String, required: true, unique: true },
    
    // Array of tokens associated with the user
    tokens: [{ token: { type: String, required: true } }],
    
    // Token for password reset
    resetPasswordToken: String,
    
    // Expiry date for the password reset token
    resetPasswordExpires: Date
}, {
    versionKey: false, // Disables the __v field that Mongoose adds by default
    timestamps: true   // Adds createdAt and updatedAt fields to the schema
});

// Hash the password before saving to the database
userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 12);
    }
    next();
});

// Method to generate a new authentication token for the user
userSchema.methods.generateAuthToken = async function() {
    // Create a JWT token using the user's ID and the secret key
    const tokenJwt = jwt.sign({ _id: this._id }, process.env.SCREAT_KEY);
    
    // Add the new token to the tokens array and save the user document
    this.tokens = this.tokens.concat({ token: tokenJwt });
    await this.save();
    
    // Return the generated token
    return tokenJwt;
};

// Create and export the user model
const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
