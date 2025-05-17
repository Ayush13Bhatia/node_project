const express = require("express");
const router = express.Router();
const product = require('../controllers/product_controller.js')

router.get('/getAllProducts', product.getAllProducts);
router.post('/postProducts', product.postProducts);
router.post('/updateProducts', product.updateProducts);
router.post('/deleteProduct/:id', product.deleteProducts);


module.exports = router;

