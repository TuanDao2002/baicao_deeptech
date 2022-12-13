const CustomError = require("../errors");
const { attachCookiesToResponse, isTokenValid } = require("../utils");

const Token = require("../models/Token");

const authenticateUser = async (req, res, next) => {
    const { refreshToken, accessToken } = req.cookies;
    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken, process.env.JWT_SECRET);
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken, process.env.JWT_SECRET);

        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken: payload.refreshToken,
        });

        if (!existingToken) {
            throw new CustomError.UnauthenticatedError(
                "Authentication Invalid"
            );
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: existingToken.refreshToken,
        });

        req.user = payload.user;
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
};

module.exports = {
    authenticateUser,
};
