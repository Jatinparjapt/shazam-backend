// Import the artist and song models
const artistModel = require("../Models/artist.model.js");
const songModel = require("../Models/songs.model.js");

// API endpoint to fetch all artists
const artists = async (req, res) => {
    try {
        // Retrieve all artist documents from the database
        const data = await artistModel.find();
        console.log(data, " data"); // Log the fetched data for debugging
        // Return a success response with the retrieved data
        return res.status(200).json({ message: "Data fetched successfully 😉", response: data });
    } catch (error) {
        // Return an error response in case of failure
        return res.status(500).json({ error: error });
    }
};

// API endpoint to fetch details of a specific artist by their ID
const artistById = async (req, res) => {
    const { artistId } = req.params; // Extract artistId from request parameters
    try {
        // Check if artistId is provided
        if (!artistId) {
            return res.status(404).json({ error: "Bad request 💩" });
        }

        // Find the artist document by artistId
        const artistDetails = await artistModel.findOne({ artistId: artistId });
        if (!artistDetails) {
            return res.status(404).json({ error: "Artist not found 💩" });
        }

        // Find the top 10 songs by the artist
        const top_10_songs = await songModel.find({ artistId: artistId }).limit(10); // Limit to 10 songs

        // Return a success response with artist details and top 10 songs
        return res.status(200).json({
            response: {
                artistDetails,
                top_10_songs
            }
        });
    } catch (error) {
        // Return an error response in case of failure
        return res.status(500).json({ error: error.message });
    }
};

// Export the API endpoint functions
module.exports = { artists, artistById };
