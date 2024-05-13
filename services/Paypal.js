const axios = require("axios");
const generateAxesToken = async function(){
    const response = await axios({
        url : process.env.PAYPAL_BASE_URL+"/v1/oauth2/token",
        method: "POST",
        data: "grant_type=client_credentials",
        auth: {
            username: process.env.PAYPAL_CLIENT_KEY,
            password: process.env.PAYPAL_SECRET_KEY
        }
    })
    return response.data.access_token
}



