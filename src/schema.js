import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    id: String,
    project: String,
    date: String,
    type: String,
    message: String,
    projectId: String
});

const projectSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    logs: [logSchema]
});

const Project = model("Project", projectSchema);
export default Project