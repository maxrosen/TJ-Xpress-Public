/*
  api.js defines the routes under the /api/ URI
*/

var express = require("express");
var router = express.Router();
const customerRouter = require("./controllers/customers");
const productRouter = require("./controllers/products");
const loginRouter = require("./controllers/logins");
const order_infoRouter = require("./controllers/order_items");
const order_statusRouter = require("./controllers/order");
const authRouter = require("./controllers/auth");

module.exports = function (db) {
  router.use("/customers", customerRouter(db));
  router.use("/products", productRouter(db));
  router.use("/logins", loginRouter(db));
  router.use("/order_items", order_infoRouter(db));
  router.use("/order", order_statusRouter(db));
  router.use("/auth", authRouter(db));

  return router;
};
