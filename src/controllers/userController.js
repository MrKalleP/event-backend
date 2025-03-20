require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")
const { User, Project } = require("../schema");

const getOneUser = async (req, res) => {
    try {
        const { userFirstName, userPassword } = req.body;

        const user = await User.findOne({ userFirstName });

        if (!user) {
            return res.status(404).json({ message: "No users found" });
        }


        const isMatch = await bcrypt.compare(userPassword, user.userPassword);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            user: {
                userFirstName: user.userFirstName,
                userId: user.id,
                projectId: user.projectId,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
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
        const { userFirstName, userLastName, projectOwnerEmail, projectId, userPassword } = req.body;

        const existingUser = await User.findOne({ userFirstName, userLastName, projectId });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists in this project." });
        }

        try {
            const mauticContactId = await createMauticContact(userFirstName, userLastName, projectOwnerEmail);

            const saltRounds = 10;
            const haschedPassword = await bcrypt.hash(userPassword, saltRounds)

            const newUser = new User({
                id: uuidv4(),
                projectId,
                userFirstName,
                userPassword: haschedPassword,
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

const getOneUserProjectId = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.find({ id: userId });
        const usersProjectIds = user[0].projectId
        const projectsForUser = await Project.find({ id: { $in: usersProjectIds } })
        res.json(projectsForUser);
    } catch (error) {
        console.error(error, "nu blev det fel");
        res.status(500).json({ error: "Ett fel uppstod vid hämtning av projekt" });
    }
};

module.exports = { getOneUser, createNewUser, getOneUserProjectId }