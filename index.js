const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./src/connection/connect.db");
const routes = require("./src/Routes/user.route.js");
const adminRoutes = require("./src/Routes/admin.route.js");

// Load environment variables
require("dotenv").config();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables Cross-Origin Resource Sharing

// API routes
app.use("/api", routes); // Routes for user-related endpoints
app.use("/admin", adminRoutes); // Routes for admin-related endpoints

// Home route
app.get("/", (req, res) => {
    res.status(200).send({ message: "Home page" });
});

// Port
const PORT = process.env.PORT || 8000;

// Connect to database and start server
connection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to the database:", err);
    });
