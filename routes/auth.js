const router = require("express").Router();
const authUserController = require("../controllers/authUserController");

router.post("/login", authUserController.handleLogin);

module.exports = router;
