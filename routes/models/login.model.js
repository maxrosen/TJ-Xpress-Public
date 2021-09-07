/*
    Defines the login model as it exists in the mySQL db
*/

const customerModel = require("./customer.model");

module.exports = (sequelize, Sequelize) => {
    const Login = sequelize.define("login", {
      
        user_id:{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        email:{
            type: Sequelize.STRING(255)
        },
        username:{
            type: Sequelize.STRING(50)
        },
        password:{
            type: Sequelize.STRING(255)
        },
        role:{
            type: Sequelize.STRING(25)
        }
        
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    });
    // Login.hasMany(customerModel);
    return Login;
}