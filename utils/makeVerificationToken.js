const { createJWT } = require("./jwt");

const makeVerificationToken = (
	username,
	email,
	password,
	secretKey,
	minutesToExpire
) => {
	const expirationDate = new Date();
	expirationDate.setMinutes(new Date().getMinutes() + minutesToExpire); // verification toke expires after a given minutes
	return createJWT(
		{ payload: { username, email, password, expirationDate } },
		secretKey
	);
};

module.exports = makeVerificationToken;
