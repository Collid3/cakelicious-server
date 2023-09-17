const router = require("express").Router();
const authUserController = require("../controllers/authUserController");

router.delete("/logout", authUserController.handleLogout);

module.exports = router;
