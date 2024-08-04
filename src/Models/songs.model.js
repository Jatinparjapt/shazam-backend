const mongoose = require("mongoose");

// Define the schema for the songs model
const songsSchema = new mongoose.Schema({
    // The name of the song
    name: { type: String, required: true },
    
    // Unique identifier for the song
    sId: { type: String, required: true },
    
    // Unique identifier for the artist of the song
    artistId: { type: String, required: true },
    
    // Name of the artist
    artist: { type: String, required: true },
    
    // URL to the song's image (album art or cover image)
    image: { type: String, required: true },
    
    // Link to the audio file of the song
    audioLink: { type: String, required: true },
    
    // Link to open the song in a specific app (e.g., Spotify, Apple Music)
    openInAppLink: { type: String, required: true },
    
    // Link to the artist's page or profile
    goToArtist: { type: String, required: true }
}, {
    versionKey: false, // Disables the __v field that Mongoose adds by default
    timestamps: true   // Adds createdAt and updatedAt fields to the schema
});

// Create and export the song model
const songModel = mongoose.model("Songs", songsSchema);
module.exports = songModel;
