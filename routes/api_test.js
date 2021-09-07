var express = require("express");
var router = express.Router();
const customerRouter = require("./controllers/customers");
const productRouter = require("./controllers/products");
const loginRouter = require("./controllers/logins");
const order_infoRouter = require("./controllers/order_items");
const order_statusRouter = require("./controllers/order");
const authRouter = require("./controllers/auth");

module.exports = function (db_test) {
  router.use("/customers", customerRouter(db_test));
  router.use("/products", productRouter(db_test));
  router.use("/logins", loginRouter(db_test));
  router.use("/order_items", order_infoRouter(db_test));
  router.use("/order", order_statusRouter(db_test));
  router.use("/auth", authRouter(db_test));

  return router;
};
