const mongoose = require("mongoose");
const { Schema } = mongoose;

const logSchema = new Schema({
    id: String,
    projectId: { type: String },
    date: { type: Date, default: Date.now },
    project: String,
    type: {
        type: String,
        enum: ["info", "error", "warning", "crashed"],
        required: true
    },
    message: String
});

const userSchema = new Schema({
    id: String,
    projectId: { type: String },
    userFirstName: String,
    userLastName: String,
    MAUTIC_CONTACT_ID: String,
    MAUTIC_USERNAME: String,
    projectOwnerEmail: String,
})

const projectSchema = new Schema({
    id: { type: String, unique: true, required: true },
    name: String,
    description: String,
    logs: [{ type: String }],
    users: [{ type: String }]
});

const User = mongoose.model("users", userSchema);
const Project = mongoose.model("projects", projectSchema);
const Logs = mongoose.model("logs", logSchema);

module.exports = { Project, Logs, User };

