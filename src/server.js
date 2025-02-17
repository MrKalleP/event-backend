const mongoose = require("mongoose");

const cors = require("cors");
const express = require("express");
const app = express();

const projectsRoutes = require("./routes/projectsRoutes");
const logsRoutes = require("./routes/logsRoutes");

const portNumber = 3000;

mongoose.connect("mongodb://localhost:27017/events_db")
    .then(async () => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error("Fel vid anslutning:", err));

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/projects", projectsRoutes);
app.use("/logs", logsRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Starta servern
app.listen(portNumber, () => {
    console.log(`Server is running on http://localhost:${portNumber}`);
});