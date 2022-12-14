const createTokenUser = (user) => {
	return {
		userId: user._id,
		name: user.username,
		email: user.email,
		coins: user.coins,
	};
};

module.exports = createTokenUser;
