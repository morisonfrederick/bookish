require("dotenv").config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SID = process.env.TWILIO_VERIFY_SID;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SID) {
    throw new Error('Twilio credentials are not set');
}

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendOtp = () => {
    client.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verifications.create({ to: "+353834398388", channel: "sms" })
        .then(verification => console.log(verification.status))
        .catch(error => console.error("Error sending OTP:", error));
};

const verifyOtp = (otpCode) => {
    return client.verify.v2
        .services(TWILIO_VERIFY_SID)
        .verificationChecks.create({ to: "+353834398388", code: otpCode })
        .then(verification_check => {
            console.log(verification_check.status);
            return verification_check.status === "approved";
        })
        .catch(error => {
            console.error("Error verifying OTP:", error);
            return false;
        });
};

module.exports = {
    sendOtp,
    verifyOtp
};
