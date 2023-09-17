const router = require("express").Router();
const User = require("../model/User");

router.post("/", async (req, res) => {
	const { username } = req.body;

	const user = await User.findOne({ username: username }).exec();

	if (user) return res.json({ user });
	res.clearCookie("jwt");
	return res.json({ error: "User not found" });
});

module.exports = router;
