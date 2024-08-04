const express = require("express");
const routes = express.Router();

// Import the necessary controller functions
const { addSongApi, addArtist, adminOTPVerify, adminCreate } = require("../Controllers/admin.api.js");

// Route for creating a new admin
// Endpoint: POST /create
// Description: Registers a new admin and sends a verification OTP to the provided email.
routes.post("/create", adminCreate);

// Route for verifying the OTP sent to the admin
// Endpoint: POST /verfiyotp
// Description: Verifies the OTP provided by the admin and completes the registration process.
routes.post("/verfiyotp", adminOTPVerify);

// Route for adding a new song
// Endpoint: POST /addsong
// Description: Adds a new song to the database. Requires a valid admin key.
routes.post("/addsong", addSongApi);

// Route for adding a new artist
// Endpoint: POST /addartist
// Description: Adds a new artist to the database. Requires a valid admin key.
routes.post("/addartist", addArtist);

module.exports = routes;
