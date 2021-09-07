/*
    Defines the customer model as it exists in the mySQL db
*/
const order_status_model = require("./order.model");

module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define("customers", {
        customer_id:{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        first_name:{
            type: Sequelize.STRING(50)
        },
        middle_name:{
            type: Sequelize.STRING(50)
        },
        last_name:{
            type: Sequelize.STRING(50)
        },
        phone:{
            type:Sequelize.STRING(11)
        },
        customer_notes:{
            type:Sequelize.TEXT
        },
        user_id:{
            type: Sequelize.INTEGER,
            references: {
                model: 'login', //might not be the right table name
                key: 'user_id'
            }
        },
        state:{
            type:Sequelize.STRING(4)
        },
        city:{
            type:Sequelize.STRING(25)
        },
        street:{
            type:Sequelize.STRING(45)
        },
        house_number:{
            type:Sequelize.INTEGER
        },
        zip:{
            type: Sequelize.STRING(6)
        },
        country:{
            type: Sequelize.STRING(4)
        },
        
        
        
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    });
    // Customer.hasMany(order_status_model);
    return Customer;
  };