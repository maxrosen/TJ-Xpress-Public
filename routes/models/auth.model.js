var passport = require("passport");
var Strategy = require("passport-local");
var db = require("./../models/db.model");
const Login = db.login;
const Customer = db.customers;

// module.exports = function (passport, user) {
module.exports = function (passport) {
  var User = Login;

  var LocalStrategy = require("passport-local").Strategy;

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with username

        usernameField: "username",

        passwordField: "password",

        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, username, password, done) {
        // console.log("Strategy started");
        // var User = user;

        // var isValidPassword = function (userpass, password) {
        //   return bCrypt.compareSync(password, userpass);
        // };
        // console.log("username: " + username);
        // console.log("password: " + password);

        Login.findAll({
          where: {
            username: username,
            password: password,
          },
        })
          .then(function (user) {
            // console.log(user);

            if (user.length === 0) {
              return done(null, false, {
                message: "invalid login credentials",
              });
            } else {
              Customer.findAll({
                where: { user_id: user[0].get({ plain: true }).user_id },
              }).then((cust_data) => {
                let cust_id = null;
                if (cust_data.length !== 0) {
                  cust_id = cust_data[0].get({ plain: true }).customer_id;
                }

                var userinfo = {
                  id: user[0].get({ plain: true }).user_id,
                  username: user[0].get({ plain: true }).username,
                  customer_id: cust_id,
                  role: user[0].get({ plain: true }).role,
                };

                return done(null, userinfo);
              });
            }
          })
          .catch(function (err) {
            // console.log("This is the Error:", err);
            return done(err);
            // return done(null, false, {
            //   message: "Something went wrong with your Signin",
            // });
          });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    // console.log("Serilization, user: " + user);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    // console.log("Deserilization, id: " + id);
    Login.findAll({
      where: {
        user_id: id,
      },
    }).then(function (user) {
      if (user.length !== 0) {
        Customer.findAll({
          where: { user_id: id },
        }).then((cust_data) => {
          let cust_id = null;
          if (cust_data.length !== 0) {
            cust_id = cust_data[0].get({ plain: true }).customer_id;
          }

          var userinfo = {
            id: user[0].get({ plain: true }).user_id,
            username: user[0].get({ plain: true }).username,
            customer_id: cust_id,
            role: user[0].get({ plain: true }).role,
          };

          done(null, userinfo);
        });
      } else {
        done(user.errors, null);
      }
    });
  });
};
