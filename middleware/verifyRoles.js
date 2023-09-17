const verifyRoles = (allowedRoles) => {
	return (req, res, next) => {
		const roles = [...allowedRoles];
		const result = roles.map((role) => req.roles.includes(role)).find((role) => role === true);

		if (!result) {
			return res.status(401).json({ error: "You dont have permision to make that request" });
		}
		next();
	};
};

module.exports = verifyRoles;
