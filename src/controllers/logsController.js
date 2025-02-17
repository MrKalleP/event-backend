
const { Logs } = require("../schema");
const { v4: uuidv4 } = require('uuid');


const getProjectLogsId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const logs = await Logs.find({ projectId });
        if (!logs.length) {
            return res.status(404).json({ error: "Projektet hittades inte eller har inga loggar." });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Något gick fel vid hämtning av loggar." });
    }
};

const getLogsByType = async (req, res) => {
    const { type } = req.params;
    try {
        const logs = await Logs.find({ type });
        if (!logs.length) {
            return res.status(404).json({ error: "Inga loggar hittades för den angivna typen." });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Något gick fel vid hämtning av loggar." });
    }
};


const getAllLogs = async (req, res) => {
    try {
        const logs = await Logs.find();
        res.json(logs)
    } catch (error) {
        res.status(500).json({ error: `"something went wrong "` });
    }
};

const getProjectLogsByType = async (req, res) => {
    const { projectId, type } = req.params;
    try {
        const logs = await Logs.find({ projectId, type });
        if (!logs.length) {
            return res.status(404).json({ error: "Inga loggar hittades för det angivna projektet och typen." });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Något gick fel vid hämtning av loggar." });
    }
};

const postLogs = async (req, res) => {
    try {
        const { projectId, type, date, message } = req.body

        const newLog = new Logs({
            id: uuidv4(),
            projectId,
            type,
            date,
            message,
        })

        await newLog.save()
        res.status(201).json({ message: "log saved!" })
    } catch {
        res.status(500).json({ error: "something went wrong" })
    }
}

module.exports = { postLogs, getProjectLogsId, getLogsByType, getAllLogs, getProjectLogsByType };


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