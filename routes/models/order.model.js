/*
    Defines the order status model as it exists in the mySQL db
*/

const customerModel = require("./customer.model");

module.exports = (sequelize, Sequelize) => {
    const Order_status = sequelize.define("order", {
        order_id:{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        customer_id:{
            type: Sequelize.INTEGER,
            references: {
                model: 'customers',
                key: 'customer_id'
            }
        },
        status:{
            type: Sequelize.STRING(50)
        },
        datetime:{
            type: Sequelize.DATE
        },
        total_price:{
            type: Sequelize.DECIMAL(10,2)
        },
        notes:{
            type: Sequelize.TEXT
        },
        received:{
            type: Sequelize.TINYINT(1)
        }
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    });

    return Order_status;
}