// Import the mongoose library
const mongoose = require("mongoose");

// Define an asynchronous function to connect to MongoDB
const connection = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGOOSE_URI);
        // Log a success message if the connection is successful
        console.log("connected to mongodb successfully");
    } catch (error) {
        // Log an error message if there is an issue with the connection
        console.error(error);
    }
};

// Export the connection function for use in other parts of the application
module.exports = connection;
