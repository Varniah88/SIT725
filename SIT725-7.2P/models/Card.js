const mongoose = require('mongoose');

// Define the Card schema
const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String }, // Optional
});

// Export the Card model
module.exports = mongoose.model('Card', cardSchema);