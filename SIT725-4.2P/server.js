const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { getCards, seedCards } = require('./collections/cardsCollections');
const Contact = require('./models/contact')

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/sustainableFashionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  seedCards()
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// cards Get
app.get('/cards', async (req, res) => {
  try {
    const cards = await getCards();
    res.json(cards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).send('Server error');
  }
});

//contact form post
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body; // Extract data from the form
    const newContact = new Contact({ name, email, message }); // Create a new document
    await newContact.save(); // Save the document to the database
    res.json({ success: true, message: 'Form submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Routes for static pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'contact.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'about.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));