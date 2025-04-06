const Contact = require('../models/Contact');

//POST messages
const submitForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (err) {
    console.error('Error submitting form:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { submitForm };
