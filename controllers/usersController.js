const Users = require("../model/User");
const bcrypt = require("bcrypt");

const allUsers = async (req, res) => {
	const user = await Users.find();
	res.json({ user });
};

const oneUser = async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ error: "Invalid Id" });
	}
	const user = await Users.findOne({ _id: id }).exec();
	if (!user) return res.status(403).json({ error: "User not found" });
	res.json({ user });
};

const addUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required" });
	}

	const duplicate = await Users.findOne({ email: email }).exec();
	if (duplicate) return res.status(401).json({ error: "Email already exists" });

	const hashedPwd = await bcrypt.hash(password, 10);

	if ((await Users.countDocuments()) === 0) {
		const result = await Users.create({
			email: email,
			roles: {
				Admin: 1112,
				Editor: 3334,
			},
			password: hashedPwd,
			cart: [],
		});
		return res.status(201).json({ result });
	}

	const result = await Users.create({ email: email, password: hashedPwd });
	return res.status(201).json({ result });
};

const updateUser = async (req, res) => {
	const { id } = req.body;

	const user = await Users.findOne({ _id: id }).exec();
	if (!user) {
		return res.status(401).json({ error: "User not found" });
	}

	if (req.body.email) user.email = req.body.email;
	if (req.body.password) user.price = req.body.price;

	const result = await user.save();
	return res.json(result);
};

const deleteAllUsers = async (req, res) => {
	const response = await Users.deleteMany({});
	res.json(response);
};

const deleteUser = async (res, req) => {
	const { id } = req.body;
	const user = await Users.findOne({ _id: id }).exec();
	if (!user) return res.status(401).json({ error: "User not found" });

	const result = await Users.deleteOne({ _id: id });
	return res.json(result);
};

module.exports = { allUsers, oneUser, addUser, updateUser, deleteUser, deleteAllUsers };
