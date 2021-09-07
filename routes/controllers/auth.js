var express = require("express");
var router = express.Router();
var dataBase = require("./../models/db.model");
var qs = require("qs");
const { Op } = require("sequelize");
var passport = require("passport");
var connectEnsureLogin = require("connect-ensure-login");

module.exports = function (db) {
  const Login = db.login;

  // localhost:3000/api/auth/
  router.route("/").get((req, res) => {
    res.end();
    // console.log(req.user);
  });

  router.post(
    "/password",
    passport.authenticate("local-signin"),
    function (req, res) {
      //   console.log("In POST");
      //   console.log("user role: " + req.user.role);
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
          res.redirect("/home");
      //res.sendFile("home.html", { root: "views" });
    }
  );

  return router;
}; 
