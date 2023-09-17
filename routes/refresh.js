const router = require("express").Router();
const handleRefresh = require("../controllers/refreshTokenController");

router.get("/", handleRefresh);

module.exports = router;
