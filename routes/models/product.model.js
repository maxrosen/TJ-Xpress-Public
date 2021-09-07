/*
    Defines the product model as it exists in the mySQL db
*/

module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        sku: {
            type: Sequelize.STRING(50)
        },
        price: {
            type: Sequelize.DECIMAL(6, 2)
        },
        name:{
            type: Sequelize.STRING(50)
        },
        total_quantity:{
            type: Sequelize.INTEGER
        },
        description:{
            type: Sequelize.TEXT
        }
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    });
    
    return Product;
  };