const express = require("express");
const { createNewLog, getTheProjectLogsByProjectId, getLogsByType, getAllLogs, getProjectLogsByType } = require("../controllers/logsController");
const router = express.Router();

router.get("/:projectId", getTheProjectLogsByProjectId);
// http://localhost:3000/logs/project/2 jag får alla project för just det projectet
router.get("/type/:type", getLogsByType);
// http://localhost:3000/logs/type/error eller info osv jag får alla errors från alla project
router.get("/", getAllLogs);
// http://localhost:3000/logs to get all logs jag får alla loggar från alla project
router.get("/:projectId/type/:type", getProjectLogsByType);
// jag får alla typer från just det projectet jag valt


router.post("/", createNewLog)
// create new log

module.exports = router;


