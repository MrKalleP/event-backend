require('dotenv').config();

const { Project, User } = require("../schema");
const { v4: uuidv4 } = require('uuid');


const getAllProjectsByTheresId = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.find({ projectId });
        const formattedProjects = project.map(({ id, name, description }) => ({
            id,
            name,
            description
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
            description: project.description
        });
    } catch {
        res.status(500).json({ message: "Server error did not fount project by id" });
    }
};

const createNewProject = async (req, res) => {
    try {
        const {
            name,
            description
        } = req.body;

        const existingProject = await Project.findOne({
            name
        })

        if (existingProject) {
            return res.status(400).json({ message: "its a project with that name allready" })
        }

        const newProject = new Project({
            id: uuidv4(),
            name,
            description,
        });

        await newProject.save();

        res.status(201).json({ message: "Project saved!", project: newProject });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong while creating the project", details: error.message });
    }
};


const getMauticContactByEmail = async (email) => {
    const MAUTIC_API_URL = process.env.MAUTIC_API_URL;
    const MAUTIC_USERNAME = process.env.MAUTIC_USERNAME;
    const MAUTIC_PASSWORD = process.env.MAUTIC_PASSWORD;

    try {
        const authString = Buffer.from(`${MAUTIC_USERNAME}:${MAUTIC_PASSWORD}`).toString("base64");

        const response = await fetch(`${MAUTIC_API_URL}/contacts?search=email:${email}`, {
            method: "GET",
            headers: {
                "Authorization": `Basic ${authString}`
            }
        });

        const data = await response.json();
        if (data.contacts && Object.keys(data.contacts).length > 0) {
            return Object.values(data.contacts)[0];
        }

        return null;
    } catch (error) {
        console.error("Error checking Mautic contact:", error.message);
        throw error;
    }
};

const createMauticContact = async (userFirstName, userLastName, projectOwnerEmail) => {
    const existingContact = await getMauticContactByEmail(projectOwnerEmail);

    if (existingContact) {
        throw new Error("A contact with this email already exists in Mautic.");
    }

    const MAUTIC_API_URL = process.env.MAUTIC_API_URL;
    const MAUTIC_USERNAME = process.env.MAUTIC_USERNAME;
    const MAUTIC_PASSWORD = process.env.MAUTIC_PASSWORD;

    try {
        const authString = Buffer.from(`${MAUTIC_USERNAME}:${MAUTIC_PASSWORD}`).toString("base64");

        const response = await fetch(`${MAUTIC_API_URL}/contacts/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${authString}`
            },
            body: JSON.stringify({
                firstname: userFirstName,
                lastname: userLastName,
                email: projectOwnerEmail
            })
        });

        const data = await response.json();
        return data.contact?.id;
    } catch (error) {
        console.error("Error creating Mautic contact:", error.message);
        throw error;
    }
};

const createNewUser = async (req, res) => {
    try {
        const { userFirstName, userLastName, projectOwnerEmail, projectId } = req.body;

        const existingUser = await User.findOne({ userFirstName, userLastName, projectId });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists in this project." });
        }

        try {
            const mauticContactId = await createMauticContact(userFirstName, userLastName, projectOwnerEmail);

            const newUser = new User({
                id: uuidv4(),
                projectId,
                userFirstName,
                userLastName,
                projectOwnerEmail,
                MAUTIC_CONTACT_ID: mauticContactId
            });

            await newUser.save();
            res.status(201).json({ message: "New User created!", user: newUser });

        } catch (mauticError) {
            res.status(400).json({ message: mauticError.message });
        }

    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ message: "Something went wrong when adding a new user" });
    }
};



module.exports = { createNewUser, getAllProjectsByTheresId, getTheProjectYouWantByItsId, createNewProject };


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