// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { addToCart, updateCartItem, deleteCartItem, getCart } = require('../controllers/cartController');

// Add item to cart
router.post('/add', addToCart);

// Update item quantity
router.put('/update', updateCartItem);

// Delete item from cart
router.delete('/delete/:productId', deleteCartItem);

// Get cart
router.get('/:userId', getCart);

module.exports = router;
  