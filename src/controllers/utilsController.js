const testData = require("../data/testdata");

const getLogsLastDays = (req, res) => {
    const { date } = req.params;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(date, 10));

    const filteredLogs = testData.projects.flatMap(project =>
        project.logs.filter(log => new Date(log.timestamp) >= daysAgo)
    );

    if (filteredLogs.length === 0) {
        return res.status(404).json({ error: "Inga loggar hittades inom den angivna tidsramen." });
    }
    res.json(filteredLogs);
};

// GET /logs/last/7 

const getLogsByTypeLastDays = (req, res) => {
    const { type, date } = req.params;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(date, 10));

    const filteredLogs = testData.projects.flatMap(project =>
        project.logs.filter(log => log.type === type && new Date(log.timestamp) >= daysAgo)
    );

    if (filteredLogs.length === 0) {
        return res.status(404).json({ error: "Inga loggar hittades för den angivna typen inom tidsramen." });
    }
    res.json(filteredLogs);
};

// GET /logs/type/error/last/7


const getLogsByMultipleTypes = (req, res) => {
    const types = req.query.types.split(","); // Exempel: ?types=error,info

    const filteredLogs = testData.projects.flatMap(project =>
        project.logs.filter(log => types.includes(log.type))
    );

    if (filteredLogs.length === 0) {
        return res.status(404).json({ error: "Inga loggar hittades för de angivna typerna." });
    }
    res.json(filteredLogs);
};

// GET /logs/types?types=error,warning

const getLogCountPerProject = (req, res) => {
    const logCounts = testData.projects.map(project => ({
        projectId: project.id,
        name: project.name,
        logCount: project.logs.length,
    }));

    res.json(logCounts);
};

// GET /logs/count 

module.exports = { getLogsLastDays, getLogCountPerProject, getLogsByMultipleTypes, getLogsByTypeLastDays };
