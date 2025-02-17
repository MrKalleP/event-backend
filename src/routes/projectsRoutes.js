const express = require("express");
const { getProjects, getProjectById, postProject } = require("../controllers/projectsController");

const router = express.Router();

router.get("/", getProjects);
router.get("/:projectId", getProjectById)
router.post("/", postProject)

module.exports = router;

