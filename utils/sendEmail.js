const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
	const transporter = nodemailer.createTransport({
	    host: "smtp.gmail.com", // hostname
	    port: 465,
	    auth: {
	        user: process.env.MAIL,
	        pass: process.env.PASS,
	    },
	});

	return transporter.sendMail({
		from: process.env.MAIL,
		to: email,
		subject,
		html,
	});
};

module.exports = sendEmail;
