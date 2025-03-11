const express = require("express");
const { getOneUser } = require("../controllers/logsController");
const router = express.Router();

router.post('/login', getOneUser);

module.exports = router;