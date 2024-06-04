const express = require("express")
const path = require("path")
const ejs = require("ejs")
const app = express();
const adminRout = require("./routes/adminRoute")
const userRoute = require("./routes/userRoute")
const mongoose = require("mongoose")
const session = require("express-session")
require("dotenv").config();
const methodOverride = require("method-override")
const expressLayouts = require("express-ejs-layouts")
const flash = require("connect-flash")



mongoose.connect(process.env.DATABASE_URL)

app.use(express.static(path.join(__dirname,"public")))
// app.use(expressLayouts)
app.use(methodOverride("_method"))

app.set("view engine", "ejs")

app.set("views",[path.join(__dirname,"views"),path.join(__dirname,"views/admin"),path.join(__dirname,"views/user")])




const oneDay = 1000*60*60*24
app.use(
    session({
      secret: "secre4tkeyw54ithran345domnum6fbers",
      saveUninitialized: false,
      cookie: { maxAge: oneDay },
      resave: false,
    })
  );

app.use(flash())

app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use("/admin",adminRout)
app.use("/home",userRoute)
app.use((req, res, next) => {
  res.status(404).render('404');
});
module.exports = app;