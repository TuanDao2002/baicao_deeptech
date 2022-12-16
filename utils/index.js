const { createJWT, isTokenValid } = require("./jwt");
const makeVerificationToken = require("./makeVerificationToken");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const sendVerificationEmail = require("./sendVerificationEmail");
const createTokenUser = require("./createTokenUser");
const attachCookiesToResponse = require("./attachCookiesToResponse");
const generateCards = require("./generateCards");
const changeDealer = require("./changeDealer");

module.exports = {
    createJWT,
    isTokenValid,
    makeVerificationToken,
    sendResetPasswordEmail,
    sendVerificationEmail,
    createTokenUser,
    attachCookiesToResponse,
    generateCards,
    changeDealer
};
