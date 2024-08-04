const express = require("express");
const routes = express.Router();

// Import the necessary controller functions
const { artists, artistById } = require("../Controllers/artist.api.js");
const { songsApi, songById } = require("../Controllers/songs.api.js");
const { loginUser, resetPassword, forgetPassword, registerUser } = require("../Controllers/user.login.signup.js");

// Route for user login
// Endpoint: POST /user/login
// Description: Authenticates a user and returns a JWT token.
routes.post("/user/login", loginUser);

// Route for user registration
// Endpoint: POST /user/signup
// Description: Registers a new user and returns a success message.
routes.post("/user/signup", registerUser);

// Route for requesting a password reset
// Endpoint: POST /user/forgetpassword
// Description: Sends a password reset link to the user's email.
routes.post("/user/forgetpassword", forgetPassword);

// Route for resetting the user's password
// Endpoint: POST /user/reset-password/:otp
// Description: Resets the user's password using the provided OTP.
routes.post("/user/reset-password/:otp", resetPassword);

// Route for fetching a list of songs
// Endpoint: GET /user/songs
// Description: Retrieves a list of songs with optional pagination.
routes.get("/user/songs", songsApi);

// Route for fetching a song by its ID
// Endpoint: GET /user/song/:songId
// Description: Retrieves a single song based on its ID.
routes.get("/user/song/:songId", songById);

// Route for fetching a list of artists
// Endpoint: GET /user/artists
// Description: Retrieves a list of artists.
routes.get("/user/artists", artists);

// Route for fetching an artist by their ID
// Endpoint: GET /user/artist/:artistId
// Description: Retrieves a single artist based on their ID.
routes.get("/user/artist/:artistId", artistById);

// Export the routes for use in the application
module.exports = routes;
