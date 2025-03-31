const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingsRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/review.js");

const userRoutes = require('./routes/user');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy = require("passport-local");

const MONGO_URL = "mongodb://127.0.0.1:27017/Lets-Out";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+1000 * 60 * 60 * 24 * 7 ,
    maxAge: 1000 * 60 * 60 * 24 * 7 ,
    httpOnly: true,
  },
}
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// passport-local-mongoose adds this method to the User model 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/demouser",async(req, res) => {
//   let fakeUser = new User({
//     username: "demoUser",
//     email: "tusharbiswas2123@gmail.com",
// });
//     let registeruser= await User.register(fakeUser, "password");
//     res.send(registeruser);
// })



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine);



app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  next(
    new ExpressError(
      "This could be because the page URL is incorrect or the page you are looking for does not exist.",
      404
    )
  );
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
