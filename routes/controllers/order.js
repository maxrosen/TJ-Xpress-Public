/*
    Defines the HTTP requests for the Order table in the database
*/

var express = require("express");
var router = express.Router();
var dataBase = require("../models/db.model");
var qs = require("qs");

const Sequelize = require("sequelize");

module.exports = function (db) {
  const Order = db.order;
  const Order_items = db.order_items;

  router
    .route("/")
    .get((req, res) => {
      const query = qs.parse(req.query);

      let this_limit = 1000;
      let this_offset = 0;

      if (query.limit) {
        this_limit = parseInt(query.limit);
      }
      if (query.offset) {
        this_offset = parseInt(query.offset);
      }

      Order.findAll({
        limit: this_limit,
        offset: this_offset,
      })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving orders.",
          });
        });
    })

    .post((req, res) => {
      if (!req.body.customer_id) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        return;
      }
      // Create a order
      const order = {
        customer_id: req.body.customer_id,
        status: req.body.status,
        datetime: new Date(Date.now()).toISOString(),
        total_price: 0,
        notes: req.body.notes,
        received: 0,
      };

      // Save order in the database

      Order.create(order)
        .then((data) => {
          res.type("application/json").send(data);
        })
        .catch((err) => {
          console.log("in catch");
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving orders.",
          });
        });
    });

  router
    .route("/order_id/:id")
    .get((req, res) => {
      const id = req.params.id;

      Order.findAll({
        where: {
          order_id: id,
        },
      })
        .then((data) => {
          if (data.length === 0) {
            res.status(500).send("Order with order_id=" + id + " not found");
          }
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving order with id=" + id,
          });
        });
    })

    //delete an individual orer
    .delete((req, res) => {
      const id = req.params.id;
      Order_items.destroy({
        where: {
          order_id: id,
        },
      })
        .then((order_items_destroy_data) => {
          if (order_items_destroy_data.length == 0) {
            console.log(
              "order: " +
                id +
                " was not destroyed successfully from the order_items table"
            );
          } else {
            // console.log("order:" + id + "was destroyed from the order_items table")
            Order.destroy({
              where: {
                order_id: id,
              },
            })
              .then((order_destroy_data) => {
                if (order_destroy_data.length == 0) {
                  console.log(
                    "order: " +
                      id +
                      " was not destroyed successfully from the order table"
                  );
                } else {
                  console.log(
                    "order: " +
                      id +
                      " was destroyed successfully from the order table"
                  );
                  res.end(
                    "order: " +
                      id +
                      " was destroyed successfully from the order table"
                  );
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while attemtping to delete the order " +
                      id,
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while attemtping to delete the order items in order = " +
                id,
          });
        });
    })
    // update a notes in an order
    .patch((req, res) => {
      // if (!req.user) {
      //   res.status(500).send("You are not signed in");
      // } else {
      const id = req.params.id;
      // fields updatabale
      let update_ordernotes = {
        status: req.body.status,
        notes: req.body.notes,
        received: req.body.received,
      };

      // if (req.user.role === "csr") {
      //   update_ordernotes.status = req.body.status;
      //   update_ordernotes.notes = req.body.notes;
      // }
      // if (req.user.role === "customer") {
      //   update_ordernotes.received = req.body.received;
      // }
      // if (req.user.role === "shipping") {
      //   update_ordernotes.status = req.body.status;
      // }

      // checks if a order is in the database by ID.
      Order.findAll({
        where: {
          order_id: id,
        },
      })
        .then((data) => {
          if (data.length === 0) {
            res.status(500).send("Order ID: " + id + " not found");
          }
          // else if (!update_ordernotes.length) {
          //   res.status(401).send("Invalid PATCH for logged in user");
          // }
          else {
            console.log(update_ordernotes.length);
            // update order using the update_order object above, where id is matched.
            Order.update(update_ordernotes, {
              returning: true,
              where: {
                order_id: id,
              },
            })
              .then(function ([rows_updated, edited_data]) {
                if (rows_updated != 0) {
                  res.send({
                    message: "Order_id=" + id + " updated",
                  });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating the Order Notes.",
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving order with id=" + id,
          });
        });
      // }
    });

  router.route("/customer_id/:id").get((req, res) => {
    const id = req.params.id;

    Order.findAll({
      where: {
        customer_id: id,
      },
      order: [["received", "ASC"]],
    })
      .then((data) => {
        if (data.length === 0) {
          res.status(200).send([]);
        }
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving order with customer_id=" + id,
        });
      });
  });

  // returns count of Orders
  router.route("/count").get((req, res) => {
    Order.count().then((c) => {
      res.send(`${c}`);
    });
  });

  return router;
};
