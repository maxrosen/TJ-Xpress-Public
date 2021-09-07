/*
  Creates the express application
*/

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var session = require("express-session"),
  bodyParser = require("body-parser");
require("dotenv").config();
// const { Sequelize, DataTypes } = require('sequelize');

// var db = require("./routes/models/db.model");
// var db_test = require("./routes/models/db.model").db_test;

// var { db, db_test } = require("./routes/models/db.model");
// var db = require("./routes/models/db.model");
var db_test = require("./routes/models/db_test.model");

// db.sequelize.sync();
// const db = null;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
// var apiRouter = require("./routes/api")(db);
var testRouter = require("./routes/api_test")(db_test);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static("public"));
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
require("./routes/models/auth.model.js")(passport);

// Creates initial URI routes
// app.use("/api", apiRouter);
app.use("/api", testRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).send();
  // res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;
