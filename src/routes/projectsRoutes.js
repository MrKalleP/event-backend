const express = require("express");
const { createNewUser, getAllProjectsByTheresId, getTheProjectYouWantByItsId, createNewProject } = require("../controllers/projectsController");

const router = express.Router();

router.get("/", getAllProjectsByTheresId);
router.get("/:projectId", getTheProjectYouWantByItsId)


router.post("/", createNewProject)
router.post("/users", createNewUser);

module.exports = router;

