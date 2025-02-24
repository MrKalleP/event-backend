
const { Logs, Project } = require("../schema");
const { v4: uuidv4 } = require('uuid');


const getTheProjectLogsByProjectId = async (req, res) => {
    const { projectId } = req.params;
    try {
        const logs = await Logs.find({ projectId });
        if (!logs.length) {
            return res.status(404).json({ error: "no logs found on the project" });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "something went wrong fetching project logs by id" });
    }
};

const getLogsByType = async (req, res) => {
    const { type } = req.params;
    try {
        const logs = await Logs.find({ type });
        if (!logs.length) {
            return res.status(404).json({ error: "No logs was found by this type" });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "something went wrong fetching logs by type" });
    }
};


const getAllLogs = async (req, res) => {
    try {
        const logs = await Logs.find();
        res.json(logs)
    } catch (error) {
        res.status(500).json({ error: `"something went wrong fetching all logs"` });
    }
};

const getProjectLogsByType = async (req, res) => {
    const { projectId, type } = req.params;
    try {
        const logs = await Logs.find({ projectId, type });
        if (!logs.length) {
            return res.status(404).json({ error: "No logs for this project was find" });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "something did go wrong fetching project by type." });
    }
};

const createNewLog = async (req, res) => {
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

        if (type.toLowerCase().includes("crashed") || type.toLowerCase().includes("error")) {
            console.log(`Kritisk logg upptäckt: ${type} - Meddelande skickat!`);
            const result = await sendEmail(4, type, message);
            console.log(result);

        }
    } catch (error) {
        throw error
    }
}

const sendEmail = async (contactId, type, message) => {

    const MAUTIC_API_URL = "http://192.168.2.181:80/api";
    const MAUTIC_USERNAME = "casperkarlsson"
    const MAUTIC_PASSWORD = "Testar123!"
    const EMAIL_TEMPLATE_ID = 3;
    const url = `${MAUTIC_API_URL}/emails/${EMAIL_TEMPLATE_ID}/contact/${contactId}/send`

    try {
        const authString = Buffer.from(`${MAUTIC_USERNAME}:${MAUTIC_PASSWORD}`).toString("base64");
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${authString}`
            },
            body: JSON.stringify({
                tokens: {
                    type: type,
                    error_message: message
                }
            })
        });

        const data = await response.json();
        console.log("E-post svar:", data);
    } catch (error) {
        throw error
    }
};



module.exports = { createNewLog, getTheProjectLogsByProjectId, getLogsByType, getAllLogs, getProjectLogsByType };


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