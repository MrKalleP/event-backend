const express = require("express");
const { getProjectLogsId, getLogsByType, getAllLogs } = require("../controllers/logsController");

const router = express.Router();

router.get("/project/:projectId", getProjectLogsId);
// http://localhost:3000/logs/project/2 
router.get("/type/:type", getLogsByType);
// http://localhost:3000/logs/type/error eller info osv
router.get("/", getAllLogs);
// http://localhost:3000/logs to get all logs
module.exports = router;