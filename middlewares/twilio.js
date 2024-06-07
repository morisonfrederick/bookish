require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

if (!accountSid || !authToken || !verifySid) {
    throw new Error('Twilio credentials are not set');
}

const client = require("twilio")(accountSid, authToken);

const sendOtp = () => {
    client.verify.v2
        .services(verifySid)
        .verifications.create({ to: "+353834398388", channel: "sms" })
        .then(verification => console.log(verification.status))
        .catch(error => console.error("Error sending OTP:", error));
};

const verifyOtp = (otpCode) => {
    return client.verify.v2
        .services(verifySid)
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
