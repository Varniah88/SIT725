// controllers/cartController.js
const Cart = require('../models/cart');

// Add item to cart
exports.addToCart = async (req, res) => {
    const { userId = 'guest', productId, title, quantity = 1 } = req.body;
  
    if (!productId || !title) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
  
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, title, quantity });
      }
  
      await cart.save();
      res.status(200).json({ success: true, message: 'Item added to cart', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
// Update item quantity
exports.updateCartItem = async (req, res) => {
    const { userId = 'guest', productId, quantity } = req.body;
  
    if (!quantity || !productId) {
      return res.status(400).json({ success: false, message: 'ProductId and quantity are required' });
    }
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  
      const item = cart.items.find(item => item.productId.toString() === productId);
      if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });
  
      item.quantity = quantity;
      await cart.save();
  
      res.status(200).json({ success: true, message: 'Cart updated', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
// Delete item from cart
exports.deleteCartItem = async (req, res) => {
    const { userId = 'guest' } = req.query; // Make sure the `userId` is passed via query params or update if using body
    const { productId } = req.params;
  
    if (!productId) {
      return res.status(400).json({ success: false, message: 'ProductId is required' });
    }
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not found in cart' });
      }
  
      cart.items.splice(itemIndex, 1); // Remove the item
      await cart.save();
  
      res.status(200).json({ success: true, message: 'Item removed from cart', cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

// Get cart
exports.getCart = async (req, res) => {
    const { userId } = req.params;
  
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
  
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
  
      res.status(200).json({ success: true, cart });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
