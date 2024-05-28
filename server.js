const http = require("http");
const app = require("./app");
const ngrok = require("ngrok")



const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port)