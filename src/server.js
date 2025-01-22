const express = require("express");
const testData = require("./testdata");


const app = express();
const portNumber = 3000;
const PORT = portNumber;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.use(express.json());


app.get("/projects", (req, res) => {
    const projects = testData.projects.map(({ id, name, description, logs }) => ({
        id,
        name,
        description,
        logs: logs.map(log => log.id)
    }));
    res.json(projects);
});


app.get("/logs/project/:projectId", (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);
    const project = testData.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: "Projektet hittades inte." });
    }
    res.json(project.logs);
});


app.get("/logs/type/:type", (req, res) => {
    const logType = req.params.type;

    const filteredLogs = testData.projects.flatMap(project =>
        project.logs.filter(log => log.type === logType)
    );
    if (filteredLogs.length === 0) {
        return res.status(404).json({ error: "Inga loggar hittades för den angivna typen." });
    }

    res.json(filteredLogs);
});

app.get("/testdata", (req, res) => {
    res.json(testData);
});

app.get("/logs", (req, res) => {
    let logs = []
    testData.projects.map((project) => {
        logs = [...logs, ...project.logs]
    });

    res.json(logs);
});


app.get("/", (req, res) => {
    res.send("Hello, World!");
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// nodemon server.js    