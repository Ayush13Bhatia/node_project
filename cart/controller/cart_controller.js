const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db.js');

const Cart = require('../model/cart_model.js')(sequelize, DataTypes);
const User = require('../../model/user_model.js')(sequelize, DataTypes);
const Product = require('../../product/model/product_model.js')(sequelize, DataTypes);


// Cart.belongsTo(User, { foreignKey: "user_id", as: "user" }); // Needed for Cart -> User include

// Cart.hasMany(Product, { foreignKey: "product_id", as: "product" });

Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });


exports.getAllCarts = async (req, res) => {
    let whereClause = {};






    if (req.params.id) {
        whereClause.cart_id = parseInt(req.params.id);
    }

    try {
        const getCarts = await Cart.findAll(
            {
                where: whereClause,
                include: [{

                    model: Product,
                    as: 'product',
                }]

            }
        );
        console.log(getCarts);
        return res.json({
            success: true,
            carts: getCarts,
        })

    } catch (e) {
        return res.json({
            success: false,
            message: "Failed to get cart items",
            error: e.message,

        })
    }
}



exports.cartsPost = async (req, res) => {
    try {
        const {
            product_id,
            user_id
        } = req.body;

        console.log('product_id', product_id);

        const carts = await Cart.create({
            product_id,
            user_id,
        });
        return res.json({
            success: true,
            message: "Product is added in cart",
        });
    } catch (e) {
        return res.json({
            success: false,
            message: "Failed to update cart",
            error: e.message,
        });
    }

}


