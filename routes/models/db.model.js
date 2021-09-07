/*
    Connects to database
    Syncs to DB in app.js
*/

var dbConfig = require("./../db.config");
var passportLocal = require("passport-local");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: "mysql",
  operatorsAliases: false,
  timestamps: false,
  logging: false,
});

async function connectAndSync() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully to prod db.");
    await sequelize.sync();
    console.log("All models were synchronized successfully for prod db.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
connectAndSync();

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//KEEP IN THIS ORDER TO PREVENT FOREIGN KEY ERRORS
db.login = require("./login.model.js")(sequelize, Sequelize);
db.customers = require("./customer.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.order = require("./order.model.js")(sequelize, Sequelize);
db.order_items = require("./order_items.model.js")(sequelize, Sequelize);

module.exports = db;
