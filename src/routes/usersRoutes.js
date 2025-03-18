const express = require("express");
const { getOneUser, createNewUser, getOneUserProjectId } = require("../controllers/userController");
const router = express.Router();

router.post('/login', getOneUser);
router.post("/users", createNewUser);
router.get("/:projectId/:userFirstName", getOneUserProjectId)

module.exports = router;