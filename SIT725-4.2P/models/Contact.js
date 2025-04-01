const mongoose = require("mongoose");

// Define the Contact schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }, // Automatically stores the submission time
});

// Export the model correctly
module.exports = mongoose.model("Contact", contactSchema);
