// Import required modules
const express = require("express");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();

// Set the port for the app (default to 3001 if not specified in the environment)
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware to handle JSON requests (optional)
app.use(express.json());

// Create a basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server running on port " + PORT);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
