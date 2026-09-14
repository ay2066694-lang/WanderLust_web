if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const { MongoStore } = require("connect-mongo");
const ExpressError = require("./utils/ExpressError.js");
const app = express();
const PORT = process.env.PORT || 4000;
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js");
const userRouter = require("./route/user.js");
const User = require("./models/user.js");

const dbUrl = process.env.MONGO_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, "/public")));



async function main() {
    await mongoose.connect(dbUrl);
}

main().then(() => {
    console.log("Connect to DB")
}).catch((err) => {
    console.log(err);
})


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo Session Store", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use((req, res, next) => {
    console.log("404 REQUEST:", req.method, req.originalUrl);
    next(new ExpressError(404, "Page not found"));
});


app.get("/favicon.ico", (req, res) => {
    res.status(204).end();
});

app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Something went wrong!";

    res.status(statusCode).render("error.ejs", {
        err: {
            message: message
        },
        currentUser: req.user || null
    });
});


console.log("Starting server...");
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on 0.0.0.0:${PORT}`);
});