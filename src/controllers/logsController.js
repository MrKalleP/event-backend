
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
            await sendEmail(projectId.projectOwnerEmail, type, message);
        }
    } catch {
        res.status(500).json({ error: "something went wrong" })
    }
}

const sendEmail = async (projectId, type, message) => {

    const MAUTIC_API_URL = "http://192.168.2.181/api";
    const MAUTIC_USERNAME = "sture";
    const MAUTIC_PASSWORD = 132

    try {

        const emailData = {
            to: projectOwnerEmail,
            subject: `Viktig logg: ${type}`,
            body: `En kritisk händelse har loggats:\n\nTyp: ${type}\nMeddelande: ${message}`,
        };

        const response = await fetch(MAUTIC_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            auth: {
                username: MAUTIC_USERNAME,
                password: MAUTIC_PASSWORD,
            },
            body: JSON.stringify(emailData),
        });

        const data = await response.json();
        console.log("E-post svar:", data);
    } catch {
        console.log("can not create a new email to project owner");
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