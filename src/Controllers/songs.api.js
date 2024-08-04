// Import the song model
const songModel = require("../Models/songs.model.js");

// API endpoint to fetch songs with pagination
const songsApi = async (req, res) => {
    try {
        // Get limit and page from query parameters, with default values
        const limit = parseInt(req.query.limit) || 20; // Default limit to 20 if not provided
        const page = parseInt(req.query.page) || 1;    // Default page to 1 if not provided

        // Calculate the number of documents to skip based on the current page and limit
        const skip = (page - 1) * limit;

        // Fetch the songs with pagination parameters
        const songs = await songModel.find().limit(limit).skip(skip);
        // console.log(songs, "songs"); // Uncomment for debugging

        // Check if songs were found and return appropriate response
        if (songs.length > 0) {
            return res.status(200).json({
                message: "Data fetched successfully 😉",
                response: songs,
                pagination: {
                    page: page,
                    limit: limit,
                },
            });
        } else {
            // Return a 404 response if no songs were found
            return res.status(404).json({ error: "No songs found 💩" });
        }
    } catch (error) {
        // Return a 500 response in case of server error
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// API endpoint to fetch a specific song by its ID
const songById = async (req, res) => {
    const { songId } = req.params; // Extract songId from request parameters
    try {
        // Find the song document by its ID
        const data = await songModel.findOne({ _id: songId });
        if (!data) {
            // Return a 404 response if the song is not found
            return res.status(404).json({ error: "Song not found 💩" });
        }
        // Return a success response with the song data
        return res.status(200).json({ message: "Data fetched successfully 😉", response: data });
    } catch (error) {
        // Return a 500 response in case of server error
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Export the API endpoint functions
module.exports = { songsApi, songById };
