const { DataTypes } = require('sequelize');
const sequelize = require('../../database/db.js');

const Products = require('../model/product_model.js')(sequelize, DataTypes);


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Products.findAll();
        return res.json({
            success: true,
            product: products,
        });
    } catch (e) {
        return res.json({
            success: false,
            message: "Failed to get products"
        });
    }
}

exports.postProducts = async (req, res) => {
    try {

        const create_at = Date().toString()
        const {
            category_id,
            product_name,
            description,
            price
        } = req.body;

        console.log(category_id);
        console.log(product_name);
        console.log(description);
        console.log(create_at);


        const product = await Products.create({
            category_id: category_id,
            product_name: product_name,
            description: description,
            price: price,
            // created_at: create_at
        });

        res.json({
            success: false,
            message: "Product created successfully",
            product: product,
        })


    } catch (e) {
        return res.json({
            success: false,
            message: "Failed to create products",
            error: e,
        });
    }
}


exports.updateProducts = async (req, res) => {
    const {
        product_id,
        category_id,
        product_name,
        description,
        price
    } = req.body;

    try {
        const existingProducts = await Products.findByPk(product_id);
        console.log("existingProducts", existingProducts);
        if (!existingProducts) {
            return res.status(400).json({
                success: false,
                message: "Product does not exist",
            });
        }

        existingProducts.product_name = product_name ?? existingProducts.product_name;
        existingProducts.price = price ?? existingProducts.price;

        existingProducts.category_id = category_id ?? existingProducts.category_id;

        existingProducts.description = description ?? existingProducts.description;

        existingProducts.save();
        return res.json({
            success: true,
            product: existingProducts,

        });
    } catch (e) {
        return res.json({
            success: false,
            message: "Product does not exist",
            error: e.message,

        });
    }


}


exports.deleteProducts = async (req, res) => {
    const productId = req.params.id;
    try {
        await Products.destroy({ where: { product_id: productId } });
        return res.json({
            success: true,
            message: "Product is deleted",
        });
    } catch (e) {
        return res.json({
            success: false,
            message: "Product does not deleted",
            error: e.message,

        })
    }
}