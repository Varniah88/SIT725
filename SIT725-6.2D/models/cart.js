const mongoose = require('mongoose');

// Define the Cart schema
const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
      title: { type: String, required: true },
      quantity: { type: Number, default: 1 },
    }
  ],
});

// Export the Cart model
module.exports = mongoose.model('Cart', cartSchema);
