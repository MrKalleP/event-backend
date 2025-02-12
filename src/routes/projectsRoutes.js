const express = require("express");
const { getProjects, getProjectById } = require("../controllers/projectsController");

const router = express.Router();

router.get("/", getProjects);
router.get("/:projectId", getProjectById)

module.exports = router;