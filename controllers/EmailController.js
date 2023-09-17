const nodemialer = require("nodemailer");
const User = require("../model/User");

const sendMessage = async (req, res) => {
	const { message, messageSubject } = req.body;
	const email = req.email;

	try {
		const selectedUser = await User.findOne({ email: email }).exec();
		if (!selectedUser) {
			return res.status(401).json({ error: "Incorrect email or password" });
		}

		if (!message || !messageSubject) {
			return res.status(400).json({ error: "No message or message subject" });
		}

		const transporter = nodemialer.createTransport({
			service: "gmail",
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: "tjmasola11@gmail.com",
				pass: process.env.GMAIL_APP_PASSWORD,
			},
		});

		const mailOptions = {
			from: email,
			to: "tjmasola11@gmail.com",
			subject: messageSubject,
			text: message,
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				return console.log(err.message);
			} else {
				return console.log("Email info: " + info.response);
			}
		});

		return res.json({ message: "Email sent" });
	} catch (err) {
		console.log("Error occured " + err.message);
		res.status(401).json({ error: err.message });
	}
};

module.exports = sendMessage;
