const express = require("express");
const projectsRoutes = require("./routes/projectsRoutes");
const logsRoutes = require("./routes/logsRoutes");
const app = express();

app.use(express.json());

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Routes 
app.use("/projects", projectsRoutes);
app.use("/logs", logsRoutes);

// Default route / homepage
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

module.exports = app;