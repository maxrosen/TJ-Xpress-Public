/*
    Defines the HTTP requests for the order_information table in the database
*/

var express = require("express");
var router = express.Router();
var dataBase = require("../models/db.model");
var qs = require("qs");

module.exports = function (db) {
  const Order_info = db.order_items;
  const Product = db.products;
  const Order = db.order;

  router
    .route("/")
    .get((req, res) => {
      Order_info.findAll()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving order info.",
          });
        });
    })

    .post((req, res) => {
      if (!req.body.order_id && !req.body.product_id) {
        res.status(400).send({
          message: "Content can not be empty!",
        });
        return;
      }
      // Create a order
      let order_items = {
        order_id: req.body.order_id,
        product_id: req.body.product_id,
        product_quantity: req.body.product_quantity,
        price: req.body.price,
      };

      // Save order in the database
      Order.findAll({
        where: {
          order_id: req.body.order_id,
        },
      }).then((order_data) => {
        let status = order_data[0].get({
          plain: true,
        }).status;
        if (
          status === "Draft" ||
          status === "Open" ||
          status === "Finalized" ||
          status === "Preparing to ship" ||
          status === "Ready for shipping"
        ) {
          Product.findAll({
            where: {
              product_id: req.body.product_id,
            },
          }).then((prod_data) => {
            if (prod_data.length === 0) {
              res
                .status(500)
                .send("product with id=" + req.body.product_id + " not found");
            } else {
              console.log(status);

              let new_prod_q =
                prod_data[0].get({
                  plain: true,
                }).total_quantity - order_items.product_quantity;
              let product_update = {
                total_quantity: new_prod_q,
              };

              if (
                order_items.product_quantity >
                prod_data[0].get({
                  plain: true,
                }).total_quantity
              ) {
                res
                  .status(500)
                  .send(
                    "Product with product_id=" +
                      req.body.product_id +
                      " does not have enough stock"
                  );
              } else {
                Product.update(product_update, {
                  returning: true,
                  where: {
                    product_id: req.body.product_id,
                  },
                });
                const p = prod_data[0].get({
                  plain: true,
                }).price;
                order_items.price =
                  parseFloat(p) * parseFloat(order_items.product_quantity);
                Order_info.create(order_items)
                  .then((data) => {
                    console.log(data);

                    Order_info.sum("price", {
                      where: {
                        order_id: req.body.order_id,
                      },
                    }).then((sum) => {
                      console.log("sum is " + sum);
                      const s = {
                        total_price: sum,
                      };
                      Order.update(s, {
                        where: {
                          order_id: req.body.order_id,
                        },
                      }).then((result) => {
                        if (result == 1) {
                          res.send({
                            message:
                              "Order item added successfully, order price has been updated.",
                          });
                        }
                      });
                    });

                    res.type("application/json").send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message:
                        err.message ||
                        "Some error occurred while retrieving orders.",
                    });
                  });
              }
            }
          });
        } else {
          res
            .status(500)
            .send(
              "Order has already left warehouse facility and cannot be modified"
            );
        }
      });
    });

  router.route("/order_id/:id").get((req, res) => {
    const id = req.params.id;

    Order_info.findAll({
      where: {
        order_id: id,
      },
    })
      .then((data) => {
        if (data.length === 0) {
          res.status(500).send("Order items for order_id=" + id + " not found");
        }
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while retrieving order items with order_id=" +
              id,
        });
      });
  });

  router
    .route("/order_id/:or_id/product_id/:prod_id")
    .delete((req, res) => {
      const or_id = req.params.or_id;
      const prod_id = req.params.prod_id;

      let update_order = {
        product_quantity: 0,
        price: 0,
      };

      Order.findAll({
        where: {
          order_id: or_id,
        },
      })
        .then((order_data) => {
          let status = order_data[0].get({
            plain: true,
          }).status;
          if (
            status === "Draft" ||
            status === "Open" ||
            status === "Finalized" ||
            status === "Preparing to ship" ||
            status === "Ready for shipping"
          ) {
            Order_info.findAll({
              where: {
                order_id: or_id,
                product_id: prod_id,
              },
            })
              .then((data) => {
                if (data.length === 0) {
                  res.status(500).send("Order ID and/or Product ID not found");
                } else {
                  // update order using the update_order object above, where id is matched.
                  Product.findAll({
                    where: {
                      product_id: prod_id,
                    },
                  })
                    .then((prod_data) => {
                      if (prod_data.length === 0) {
                        res
                          .status(500)
                          .send("product with id=" + prod_id + " not found");
                      } else {
                        let new_prod_q =
                          prod_data[0].get({
                            plain: true,
                          }).total_quantity +
                          data[0].get({
                            plain: true,
                          }).product_quantity;
                        let product_update = {
                          total_quantity: new_prod_q,
                        };
                        Product.update(product_update, {
                          returning: true,
                          where: {
                            product_id: prod_id,
                          },
                        });

                        Order_info.destroy({
                          where: {
                            order_id: or_id,
                            product_id: prod_id,
                          },
                        }).then((order_data) => {
                          if (order_data.length === 0) {
                            res
                              .status(500)
                              .send("Order with id=" + or_id + " not found");
                          } else {
                            Order_info.sum("price", {
                              where: {
                                order_id: or_id,
                              },
                            }).then((sum) => {
                              console.log("sum is " + sum);
                              const s = {
                                total_price: sum,
                              };
                              Order.update(s, {
                                where: {
                                  order_id: or_id,
                                },
                              }).then((result) => {
                                if (result == 1) {
                                  res.send({
                                    message:
                                      "total price was updated successfully.",
                                  });
                                }
                              });
                            });
                          }
                        });
                        res.send({
                          message: "Order updated",
                        });
                      }
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          err.message ||
                          "Some error occurred while updating the Order.",
                      });
                    });
                }
              })
              .catch((err) => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while retrieving order with id=" +
                      or_id,
                });
              });
          } else {
            res
              .status(500)
              .send(
                "Order has already left warehouse facility and cannot be modified"
              );
          }
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while retrieving order with id=" + or_id,
          });
        });
    })

    // update a order
    .patch((req, res) => {
      const or_id = req.params.or_id;
      const prod_id = req.params.prod_id;
      // fields updatabale
      let update_order = {
        product_quantity: req.body.product_quantity,
        price: req.body.price,
      };
      if (!update_order.product_quantity) {
        res.status(500).send("You cheater");
        return;
      }

      if (!update_order.product_quantity) {
        res.status(500).send("Product quantity cannot be blank");
        return;
      }

      // checks if a order is in the database by ID.

      Order.findAll({
        where: {
          order_id: or_id,
        },
      }).then((or_data) => {
        let status = or_data[0].get({
          plain: true,
        }).status;

        if (
          status === "Draft" ||
          status === "Open" ||
          status === "Finalized" ||
          status === "Preparing to ship" ||
          status === "Ready for shipping"
        ) {
          Order_info.findAll({
            where: {
              order_id: or_id,
              product_id: prod_id,
            },
          })
            .then((data) => {
              if (data.length === 0) {
                res.status(500).send("Order ID and/or Product ID not found");
              } else {
                // update order using the update_order object above, where id is matched.

                Product.findAll({
                  where: {
                    product_id: prod_id,
                  },
                }).then((prod_data) => {
                  if (prod_data.length === 0) {
                    res
                      .status(500)
                      .send("product with id=" + prod_id + " not found");
                  } else {
                    let new_prod_q =
                      prod_data[0].get({
                        plain: true,
                      }).total_quantity -
                      (update_order.product_quantity -
                        data[0].get({
                          plain: true,
                        }).product_quantity);
                    let product_update = {
                      total_quantity: new_prod_q,
                    };

                    if (
                      update_order.product_quantity >
                      prod_data[0].get({
                        plain: true,
                      }).total_quantity
                    ) {
                      res
                        .status(500)
                        .send(
                          "Product with product_id=" +
                            prod_id +
                            " does not have enough stock"
                        );
                    } else {
                      Product.update(product_update, {
                        returning: true,
                        where: {
                          product_id: prod_id,
                        },
                      });

                      Order_info.update(update_order, {
                        returning: true,
                        where: {
                          order_id: or_id,
                          product_id: prod_id,
                        },
                      })
                        .then(function ([rows_updated, edited_data]) {
                          if (rows_updated != 0) {
                            Order.findAll({
                              where: {
                                order_id: or_id,
                              },
                            }).then((order_data) => {
                              if (order_data.length === 0) {
                                res
                                  .status(500)
                                  .send(
                                    "Order with id=" + or_id + " not found"
                                  );
                              } else {
                                Order_info.sum("price", {
                                  where: {
                                    order_id: or_id,
                                  },
                                }).then((sum) => {
                                  console.log("sum is " + sum);
                                  const s = {
                                    total_price: sum,
                                  };
                                  Order.update(s, {
                                    where: {
                                      order_id: or_id,
                                    },
                                  }).then((result) => {
                                    if (result == 1) {
                                      res.send({
                                        message:
                                          "total price was updated successfully.",
                                      });
                                    }
                                  });
                                });
                              }
                            });
                            res.send({
                              message: "Order updated",
                            });
                          }
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message:
                              err.message ||
                              "Some error occurred while updating the Order.",
                          });
                        });
                    }
                  }
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating the Order.",
              });
            });
        } else {
          res
            .status(500)
            .send(
              "Order has already left warehouse facility and cannot be modified"
            );
        }
      });
    });

  return router;
};
