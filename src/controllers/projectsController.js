
const { Project } = require("../schema");
const { v4: uuidv4 } = require('uuid');


const getAllProjectsByTheresId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.find({ projectId });
        const formattedProjects = project.map(({ id, name, description, logs }) => ({
            id,
            name,
            description,
            logs: logs.map(logId => logId.toString())
        }));
        res.json(formattedProjects);
    } catch {
        console.log("did not find the project");
    }
};

const getTheProjectYouWantByItsId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ message: "Project id not found" });
        }

        res.json({
            id: project.id,
            name: project.name,
            description: project.description,
            logs: project.logs.map(log => log.id),
        });
    } catch {
        res.status(500).json({ message: "Server error did not fount project by id" });
    }
};

const createNewProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const newProject = new Project({
            id: uuidv4(),
            name,
            description,
            logs: [],
        });

        await newProject.save();

        res.status(201).json({ message: "Projekt och loggar sparade!", project: newProject });
    } catch (error) {
        res.status(500).json({ error: "Något gick fel vid skapandet av projektet", details: error.message });
    }
};

module.exports = { getAllProjectsByTheresId, getTheProjectYouWantByItsId, createNewProject };


/*
här så hämtar jag testdatan 
getProjects är en function som har två argument en req som innehåller information om den inkommande förfrågan res används för att skicka ett svar till klienten
så hur fungerar denna 
1 den hämtar en lista av project
2 för varje project i den här listan så skapas ett nytt object som då ska innehålla id, namn, description obs oförändrade 
3 sen så har vi logs där vi får en lista av bara id från varje logg, vi ersätter den ursprungliga koden och ersätter med id

res.json(project) är respons till klienten i form av json

module.exports = {getProjects} => används i projectRoutes där sökvägen till den här datan sätts
*/ 