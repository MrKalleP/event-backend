const portNumber = 3000;

const cors = require("cors")
const express = require("express");
const app = express()

const projectsRoutes = require("./routes/projectsRoutes");
const logsRoutes = require("./routes/logsRoutes");

app.use(express.json());
app.use(cors())

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

app.listen(portNumber, () => {
    console.log(`Server is running on http://localhost:${portNumber}`);
});


// starting server  =>   nodemon src/server.js