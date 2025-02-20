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

const projectSchema = new Schema({
    id: { type: String, unique: true, required: true },
    name: String,
    description: String,
    projectOwnerEmail: String,
    logs: [{ type: String }]
});

const Project = mongoose.model("projects", projectSchema);
const Logs = mongoose.model("logs", logSchema);

module.exports = { Project, Logs };

