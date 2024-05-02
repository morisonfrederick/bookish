require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require("twilio")(accountSid, authToken);

const sendOtp =function(){ client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+353834398388", channel: "sms" })
  .then((verification) => console.log(verification.status))
  }

const verifyOtp = ((otpCode) => {
    return client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: "+353834398388", code: otpCode })
      .then((verification_check) => {
        console.log(verification_check.status)
        if(verification_check.status=="approved"){
          return true
        }
        else{
          return false
        }
        
      })
  })


  module.exports = {
    sendOtp,
    verifyOtp
  }