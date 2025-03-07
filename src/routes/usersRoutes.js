const express = require("express");
const { getOneUser } = require("../controllers/logsController");
const router = express.Router();

router.get('/:userFirstName/:userPassword', getOneUser);

module.exports = router;