/*
  index.js defines which html pages will be rendered for each URI
*/

var express = require("express");
var router = express.Router();
var connectEnsureLogin = require("connect-ensure-login");
var passport = require("passport");

/* GET home page. */
router.get(
  "/",
  // connectEnsureLogin.ensureLoggedIn("/api/auth"),
  function (req, res, next) {
    // console.log("User: " + req.user);
    // console.log("Session: " + req.session);
    res.sendFile("homepage.html", { root: "views" });
  }
);

router.get("/home", function (req, res, next) {
  res.sendFile("home.html", { root: "views" });
});

router.get("/homepage", function (req, res, next) {
  res.sendFile("homepage.html", { root: "views" });
});

module.exports = router;
