import Project from "./schema"

const portNumber = 3000;

const cors = require("cors")
const express = require("express");
const app = express()

const projectsRoutes = require("./routes/projectsRoutes");
const logsRoutes = require("./routes/logsRoutes");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/events_db")
    .then(() => console.log("MongoDB ansluten"))
    .catch(err => console.error("Fel vid anslutning:", err));

const project = new Project({
    id: "1",
    name: "Mitt första projekt",
    description: "Detta är ett testprojekt",
    logs: [
        {
            id: "1",
            project: "Mitt första projekt",
            date: new Date().toISOString(),
            type: "info",
            message: "Projekt skapat",
            projectId: "1"
        }
    ]
})

await project.save()
console.log(project);

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