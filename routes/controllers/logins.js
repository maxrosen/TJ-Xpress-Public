/*
    Defines the HTTP requests for the logins table in the database
*/

var express = require("express");
var router = express.Router();
var dataBase = require("./../models/db.model");
const { order_items, order } = require("./../models/db.model");
const db_test = require("../models/db_test.model");

module.exports = function (db) {
  const Login = db_test.login;
  const Customer = db.customers;
  const Order = db.order;
  const Order_items = db.order_items;
  router
    .route("/")
    .get((req, res) => {
      Login.findAll()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials.",
          });
        });
    })
    .post((req, res) => {
      if (!req.body.username && !req.body.email && !req.body.password) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        return;
      }
      // Create a login

      // Save login in the database

      const new_login = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      };

      // Check if login exists, if not, create it
      Login.findAll({
        where: {
          username: new_login.username,
        },
      }).then((data) => {
        if (data.length === 0) {
          Login.create(new_login)
            .then((log_data) => {
              res.type("application/json").send(log_data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the login.",
              });
            });
        } else {
          res
            .status(400)
            .send(
              "Product with username=" + new_login.username + " already exists"
            );
        }
      });
    });

  //delete login which also deletes instances of the customer in the customer, order and order items table
  //line 101 is the filter for whether or not the order has been received
  router
    .route("/user_id/:id")
    .get((req, res) => {
      const id = req.params.id;
      Login.findAll({ where: { user_id: id } })
        .then((data) => {
          let email = data[0].get({ plain: true }).email;
          let username = data[0].get({ plain: true }).username;
          res.send({ email: email, username: username });
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving tutorials.",
          });
        });
    })
    .delete((req, res) => {
      const id = req.params.id;
      var cust_id;
      Customer.findAll({
        where: {
          user_id: id,
        },
      })
        .then((cust_data) => {
          if (cust_data.length !== 0) {
            cust_id = cust_data[0].get({
              plain: true,
            }).customer_id;

            Order.findAll({
              where: {
                customer_id: cust_id,
                // received: 'true'
              },
            }).then((order_data) => {
              if (order_data.length === 0) {
                res.send({
                  message: "No orders linked to customer id:" + cust_id,
                });
              } else {
                let order_ids = [];
                order_data.forEach((element) => {
                  order_ids.push(
                    element.get({
                      plain: true,
                    }).order_id
                  );
                });
                order_ids.forEach((order) => {
                  setTimeout(function () {}, 100);
                  Order_items.destroy({
                    where: {
                      order_id: order,
                    },
                  })
                    .then((order_items_destroy_data) => {
                      if (order_items_destroy_data.length == 0) {
                        console.log(
                          "order:" +
                            order +
                            "was not destroyed successfully from the order_items table"
                        );
                      } else {
                        console.log(
                          "order:" +
                            order +
                            "was destroyed from the order_items table"
                        );
                      }
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while attemtping to delete the order items in order=" +
                            order,
                      });
                    });
                  setTimeout(function () {}, 100);
                  Order.destroy({
                    where: {
                      order_id: order,
                    },
                  })
                    .then((order_destroy_data) => {
                      if (order_destroy_data.length == 0) {
                        console.log(
                          "order:" +
                            order +
                            "was not destroyed successfully from the order table"
                        );
                      } else {
                        console.log(
                          "order:" +
                            order +
                            "was destroyed successfully from the order table"
                        );
                      }
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while attemtping to delete the order" +
                            order,
                      });
                    });
                });
              }
              setTimeout(function () {}, 100);
              Customer.destroy({
                where: {
                  user_id: id,
                },
              })
                .then((cust_destroy_data) => {
                  if (cust_destroy_data.length == 0) {
                    console.log(
                      "customer with a user_id: " +
                        id +
                        "was not successfully destroyed"
                    );
                  } else {
                    console.log(
                      "customer with a user_id: " +
                        id +
                        "was successfully destroyed"
                    );
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while attempting to delete the customer data",
                  });
                });
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving the orders linked to the customer info with a user_id=" +
                id,
          });
        });
      setTimeout(function () {}, 100);
      Login.destroy({
        where: {
          user_id: id,
        },
      })
        .then((login_destroy_data) => {
          if (login_destroy_data.length == 0) {
            console.log(
              "user login with a user_id: " +
                id +
                "was not successfully destroyed"
            );
          } else {
            console.log(
              "user login with a user_id: " + id + "was successfully destroyed"
            );
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while attempting to delete the login data",
          });
        });
      res.end();
    });

  return router;
};
