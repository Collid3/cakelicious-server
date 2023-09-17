const router = require("express").Router();
const sendMessage = require("../controllers/EmailController");

router.post("/", sendMessage);

module.exports = router;
