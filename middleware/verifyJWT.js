const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
	const authHeader = req.headers["authorization"] || req.headers["Authorization"];
	if (!authHeader) return res.status(400).json({ error: "Access Token not found" });
	const accessToken = authHeader.split(" ")[1];

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
		if (err) return res.status(403).json({ error: "User not logged in" });
		req.email = decoded.userInfo.email;
		req.roles = decoded.userInfo.roles;
		next();
	});
};

module.exports = verifyJWT;
