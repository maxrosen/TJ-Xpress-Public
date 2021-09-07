/*
    Defines the HTTP requests for the products table in the database
*/

var express = require("express");
var router = express.Router();
var dataBase = require("./../models/db.model");
var qs = require("qs");
const { Op } = require("sequelize");

module.exports = function (db) {
  const Product = db.products;

  router
    .route("/")
    .get((req, res) => {
      const query = qs.parse(req.query);

      let this_limit = 1000;
      let this_offset = 0;
      let prod_name = "";

      if (query.limit) {
        this_limit = parseInt(query.limit);
      }
      if (query.offset) {
        this_offset = parseInt(query.offset);
      }

      if (query.name) {
        prod_name = query.name;
      }

      Product.findAll({
        where: {
          name: { [Op.like]: "%" + prod_name + "%" },
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
              err.message || "Some error occurred while retrieving tutorials.",
          });
        });
    })
    .post((req, res) => {
      if (Object.keys(req.body).length === 0 || !req.body.sku) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        return;
      }
      // Create a product

      // Save product in the database

      const new_product = {
        sku: req.body.sku,
        price: req.body.price,
        name: req.body.name,
        total_quantity: req.body.total_quantity,
        description: req.body.description,
      };

      // Check is product with sku already exists, if not, create the product

      Product.findAll({ where: { sku: new_product.sku } }).then((data) => {
        if (data.length === 0) {
          Product.create(new_product)
            .then((prod_data) => {
              res.type("application/json").send(prod_data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the product.",
              });
            });
        } else {
          res
            .status(400)
            .send("Product with sku=" + new_product.sku + " already exists");
        }
      });
    });

  router
    .route("/product_id/:id")
    .get((req, res) => {
      const id = req.params.id;

      Product.findAll({ where: { product_id: id } })
        .then((data) => {
          if (data.length === 0) {
            res
              .status(500)
              .send("Product with product_id=" + id + " not found");
          }
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving product with id=" + id,
          });
        });
    })
    // update a notes in an order
    .patch((req, res) => {
      const id = req.params.id;
      // fields updatabale
      const update_productquantity = {
        total_quantity: req.body.total_quantity,
      };

      // checks if a order is in the database by ID.
      Product.findAll({ where: { product_id: id } })
        .then((data) => {
          if (data.length === 0) {
            res.status(500).send("Product ID: " + id + " not found");
          } else {
            // update order using the update_order object above, where id is matched.
            Product.update(update_productquantity, {
              returning: true,
              where: { product_id: id },
            })
              .then(function ([rows_updated, edited_data]) {
                if (rows_updated != 0) {
                  res.send({ message: "Product quantity updated" });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating the product quantity.",
                });
              });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving product with id=" + id,
          });
        });
    });

  // returns count of Products
  router.route("/count").get((req, res) => {
    Product.count().then((c) => {
      res.send(`${c}`);
    });
  });

  return router;
};
