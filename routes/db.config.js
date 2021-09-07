/*
    Configures connection to mySQL database
    Connection is established in db.model.js
*/
require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  DB_TEST: process.env.DB_TEST,
};
