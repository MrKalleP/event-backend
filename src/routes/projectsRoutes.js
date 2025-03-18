const express = require("express");
const { getAllProjectsByTheresId, getTheProjectYouWantByItsId, createNewProject } = require("../controllers/projectsController");

const router = express.Router();

router.get("/", getAllProjectsByTheresId);
router.get("/:projectId", getTheProjectYouWantByItsId)


router.post("/", createNewProject)


module.exports = router;

