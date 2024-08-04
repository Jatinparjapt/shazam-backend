const mongoose = require("mongoose");

// Define the schema for the artist model
const artistSchema = new mongoose.Schema({
    // The name of the artist
    name: { type: String, required: true },
    
    // Unique identifier for the artist
    artistId: { type: String, required: true },
    
    // Social media links associated with the artist
    socialMedia: [{ link: { type: String } }],
    
    // URL to the artist's image
    image: { type: String, required: true },
    
    // Short biography or description of the artist
    biography: { type: String }
}, {
    versionKey: false, // Disables the __v field that Mongoose adds by default
    timestamps: true   // Adds createdAt and updatedAt fields to the schema
});

// Create and export the artist model
const artistModel = mongoose.model("Artists", artistSchema);
module.exports = artistModel;
