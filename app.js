const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const Bundler = require("parcel-bundler");

const bcrypt = require("bcrypt");

// Set up mongoose connection
const mongoose = require("mongoose");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const config = require("./config");

const userModel = require("./models/user");

const indexRouter = require("./routes/index");
const adminRoutes = require("./routes/admin");

// API
const apiRouter = require("./routes/api");

// TODO: Remove startup definitivly if not needed at all in the future
// const startup = require("./startup");

// startup();

let mongoDB = config.MONGODB_URI;

mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async function(username, password, cb) {
      await userModel.find({ username }, async function(err, userArray) {
        const [user, ...rest] = userArray;
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false);
        }

        const isPasswordOk = await bcrypt.compare(password, user.password);

        if (!isPasswordOk) {
          return cb(null, false);
        }
        return cb(null, user);
      });
    }
  )
);

// serialize user object
passport.serializeUser(function(user, done) {
  done(null, user);
});

// deserialize user object

passport.deserializeUser(function(id, cb) {
  userModel.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

const app = express();

// PARCEL BUNDLER FOR FRONTEND
const jsbaseFile = "./frontend/src/js/index.js"; // Passe ici un chemin absolu vers le point d'entrée
const parcelConfig = require("./parcelConfig");

// Initialise un nouveau bundler en utilisant un fichier et des options
const bundler = new Bundler(jsbaseFile, parcelConfig);
// Permet à express d'utiliser le middelware de bundler, cela permettra à Parcel de gérer chaque requête sur votre serveur express
app.use(bundler.middleware());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend/dist")));

const sess = {
  secret: config.EXPRESS_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));
app.use(passport.initialize());
// bodyParser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(require("morgan")("combined"));
app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
app.use("/admin", adminRoutes);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
