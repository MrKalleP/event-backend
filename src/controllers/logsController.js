const testData = require("../data/testdata");

const getProjectLogs = (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);
    const project = testData.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: "Projektet hittades inte." });
    }
    res.json(project.logs);
};

const getLogsByType = (req, res) => {
    const logType = req.params.type;
    const filteredLogs = testData.projects.flatMap(project =>
        project.logs.filter(log => log.type === logType)
    );

    if (filteredLogs.length === 0) {
        return res.status(404).json({ error: "Inga loggar hittades för den angivna typen." });
    }
    res.json(filteredLogs);
};

const getAllLogs = (req, res) => {
    const logs = testData.projects.flatMap(project => project.logs);
    res.json(logs);
};

module.exports = { getProjectLogs, getLogsByType, getAllLogs };


/*
getProjectLogs 
syftet med den här functionen är att hämta loggar för ett specifikt project baserat på id

1 tar ut projectId från url-parametern req.params.projectId
2 söker efter projectet i testdata.projects efter motsvarande id
3 om projectet inte hittas deremot så skickas 404 att projectet inte hittades 
4 om projectet hittades skicka dem här loggarna i json format

getLogsByType
syftet hämtar alla loggar av en specefikt typ för projecten 

1 tar ut type från url-parametern req.params.type
2 använder flatMap för att gå genom alla project och samla loggar som matchar den angivna typen
3 om inga loggar hittas skickas medelandet Inga loggar hittades för den angivna typen
4 om matchande loggar hittas skickas de i json fortmat 

getAllLogs 
1 använder flatMap för att samla alla loggar från varje project i en lista
2 skickar denna lista som json
*/