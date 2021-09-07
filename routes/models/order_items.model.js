/*
    Defines the login model as it exists in the mySQL db
*/
const order_status = require("./order.model");
const product = require("./product.model");

module.exports = (sequelize, Sequelize) => {
    const Order_information = sequelize.define("order_items", {
        order_id:{
            type: Sequelize.INTEGER,
            references: {
                model: 'order',
                key: 'order_id'            
            }
        },
        product_id:{
            type: Sequelize.INTEGER,
            references: {
                model: 'products',
                key: 'product_id'
            }
        },
        product_quantity:{
            type: Sequelize.INTEGER
        },
        price:{
            type: Sequelize.DECIMAL(10,2)
        }
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    });
    // Order_information.hasMany(order_status);
    // Order_information.hasMany(product);
    Order_information.removeAttribute('id');
    return Order_information;
}