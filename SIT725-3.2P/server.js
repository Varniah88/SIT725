const express = require('express');
const path = require('path');

const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'contact.html'));
  });
  
  app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'about.html'));
  });

// Handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;

  // Log form data (replace this with database saving or email notifications)
  console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

  // Send a response
  res.send('Form submitted successfully!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});