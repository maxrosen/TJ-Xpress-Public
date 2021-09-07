/*
    Defines the HTTP requests for the customers table in the database
*/

var express = require("express");
var router = express.Router();
var dataBase = require("./../models/db.model");
var qs = require("qs");
const { Op } = require("sequelize");
// const Customer = dataBase.customers;

module.exports = function (db) {
  const Customer = db.customers;

  router
    .route("/")
    .get((req, res) => {
      // console.log("req.user.role: " + req.user.role);
      // console.log("req.user.customer_id: " + req.user.customer_id);
      const query = qs.parse(req.query);

      let this_limit = 1000;
      let this_offset = 0;
      let f_name = "";
      let l_name = "";

      if (query.limit) {
        this_limit = parseInt(query.limit);
      }
      if (query.offset) {
        this_offset = parseInt(query.offset);
      }

      if (query.first_name) {
        f_name = query.first_name;
      }
      if (query.last_name) {
        l_name = query.last_name;
      }

      Customer.findAll({
        where: {
          first_name: { [Op.like]: "%" + f_name + "%" },
          last_name: { [Op.like]: "%" + l_name + "%" },
        },
        limit: this_limit,
        offset: this_offset,
      })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving customers.",
          });
        });
    })

    .post((req, res) => {
      if (!req.body.first_name) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        return;
      }
      // Create a customer

      // Save customer in the database

      const new_customer = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        customer_notes: req.body.customer_notes,
        user_id: req.body.user_id,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        house_number: req.body.house_number,
        zip: req.body.zip,
        country: req.body.country,
      };

      // Check if customer with phone number already exists, if not, create it

      Customer.findAll({ where: { phone: new_customer.phone } })
        .then((data) => {
          if (data.length === 0) {
            Customer.create(new_customer)
              .then((cus_data) => {
                res.type("application/json").send(cus_data);
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the customer.",
                });
              });
          } else {
            res
              .status(400)
              .send(
                "Customer with phone number=" +
                  new_customer.phone +
                  " already exists"
              );
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving customer with id=" + id,
          });
        });
    });

  router
    .route("/customer_id/:id")
    .get((req, res) => {
      const id = req.params.id;

      Customer.findAll({ where: { customer_id: id } })
        .then((data) => {
          if (data.length === 0) {
            res
              .status(500)
              .send("Customer with customer_id=" + id + " not found");
          }
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving customer with id=" + id,
          });
        });
    })
    // update a customer
    .patch((req, res) => {
      const id = req.params.id;
      // fields updatabale
      const update_customer = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        customer_notes: req.body.customer_notes,
        state: req.body.state,
        city: req.body.city,
        street: req.body.street,
        house_number: req.body.house_number,
        zip: req.body.zip,
        country: req.body.country,
      };
      // checks if a customer is in the database by ID.
      Customer.findAll({ where: { customer_id: id } })
        .then((data) => {
          if (data.length === 0) {
            res.status(500).send("Customer ID: " + id + " not found");
          } else {
            // update customer using the update_customer object above, where id is matched.
            Customer.update(update_customer, {
              returning: true,
              where: { customer_id: id },
            })
              .then(function ([rows_updated, edited_data]) {
                if (rows_updated != 0) {
                  res.send({ message: "customer updated" });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating the customer.",
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving customer with id=" + id,
          });
        });
    });

  // returns count of Customers
  router.route("/count").get((req, res) => {
    Customer.count().then((c) => {
      res.send(`${c}`);
    });
  });

  return router;
};
