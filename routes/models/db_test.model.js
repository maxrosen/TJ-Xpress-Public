/*
    Connects to database
    Syncs to DB in app.js
*/

var dbConfig = require("./../db.config");

const Sequelize = require("sequelize");

const sequelize_test = new Sequelize(
  dbConfig.DB_TEST,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: "mysql",
    operatorsAliases: false,
    timestamps: false,
    logging: false,
  }
);

async function connectAndSync() {
  try {
    await sequelize_test.authenticate();
    console.log("Connection has been established successfully to test db.");
    await sequelize_test.sync();
    console.log("All models were synchronized successfully for test db.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
connectAndSync();

const db_test = {};

db_test.Sequelize = Sequelize;
db_test.sequelize = sequelize_test;

//KEEP IN THIS ORDER TO PREVENT FOREIGN KEY ERRORS

db_test.login = require("./login.model.js")(sequelize_test, Sequelize);
db_test.customers = require("./customer.model.js")(sequelize_test, Sequelize);
db_test.products = require("./product.model.js")(sequelize_test, Sequelize);
db_test.order = require("./order.model.js")(sequelize_test, Sequelize);
db_test.order_items = require("./order_items.model.js")(
  sequelize_test,
  Sequelize
);

module.exports = db_test;
