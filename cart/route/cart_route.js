const express = require("express");
const router = express.Router();
const cartController = require('../controller/cart_controller.js');

router.post('/cartPost', cartController.cartsPost);
router.get(['/getCart', '/getCart/:id'], cartController.getAllCarts);



module.exports = router;