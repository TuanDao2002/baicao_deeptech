const sendEmail = require("./sendEmail");

const sendVerificationEmail = async (
    browser,
    email,
    verificationToken,
    origin,
    minutesToExpire
) => {
    const verifyEmail = `${origin}/verify-email?token=${verificationToken}`;
    const message = `<center><h3>There is a new sign up with this email at ${browser} browser.</h3></center>
                    <center><h3>If this was you, clicking on the following link (it will expire after ${minutesToExpire} minutes): <a href="${verifyEmail}">Verify Email</a></h3><center>`;
    return sendEmail(email, "Email confirmation", message);
};

module.exports = sendVerificationEmail;
