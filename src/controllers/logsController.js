require('dotenv').config();

const { Logs, User } = require("../schema");
const { v4: uuidv4 } = require('uuid');


const getLogsByTypeForOneUser = async (req, res) => {
    const { projectId, type } = req.params;
    try {
        const logs = await Logs.find({ type, projectId });

        if (!logs.length) {
            return res.status(404).json({ error: "No logs were found for this project and type" });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong fetching logs by type" });
    }
};

const getLogsForOneUser = async (req, res) => {
    const { projectId, userId } = req.params;
    try {
        const user = await User.findOne({ id: userId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        const userProjectIds = user.projectId

        if (!userProjectIds.includes(projectId)) {
            return res.status(403).json({ error: "Access denied to this project" });
        }
        const logs = await Logs.find({ projectId });

        if (!logs.length) {
            return res.status(404).json({ error: "No logs found for this project" });
        }

        res.json(logs);

    } catch (error) {
        res.status(500).json({ error: "Something went wrong fetching project logs" });
    }
};

const getLogsForMultipleProjects = async (req, res) => {
    const { projectIds } = req.body;
    try {
        const logs = await Logs.find({ projectId: { $in: projectIds } });
        if (!logs.length) {
            return res.status(404).json({ error: "No logs found for the given projects" });
        }
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong fetching logs for multiple projects" });
    }
};

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
        console.log(newLog);

        await newLog.save()
        res.status(201).json({ message: "log saved!" })

        if (type.toLowerCase().includes("crashed") || type.toLowerCase().includes("error")) {

            const users = await User.find({ projectId: projectId });

            if (users.length > 0) {
                for (const user of users) {
                    if (user.MAUTIC_CONTACT_ID) {
                        const result = await sendEmail(user.MAUTIC_CONTACT_ID, type, message);
                        console.log(`Email sent to ${user.projectOwnerEmail}:`, result);
                    } else {
                        console.log(`No MAUTIC_CONTACT_ID for user: ${user.projectOwnerEmail}`);
                    }
                }
            } else {
                console.log("No users found for this project.");
            }
        }
    } catch (error) {
        throw error
    }
}

const sendEmail = async (contactId, type, message) => {

    const MAUTIC_API_URL = process.env.MAUTIC_API_URL;
    const MAUTIC_USERNAME = process.env.MAUTIC_USERNAME;
    const MAUTIC_PASSWORD = process.env.MAUTIC_PASSWORD;
    const EMAIL_TEMPLATE_ID = process.env.EMAIL_TEMPLATE_ID;

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
        console.log("Email reply:", data);

    } catch (error) {
        throw error
    }
};



module.exports = { getLogsForMultipleProjects, getLogsByTypeForOneUser, getLogsForOneUser, createNewLog, getTheProjectLogsByProjectId, getLogsByType, getAllLogs, getProjectLogsByType };


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