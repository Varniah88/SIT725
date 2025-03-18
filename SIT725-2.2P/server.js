const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for adding two numbers (GET method)
app.get('/add', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Invalid numbers provided' });
    }

    const sum = num1 + num2;
    res.json({ num1, num2, sum });
});

// Route for substracting two numbers (GET method)
app.get('/subtract', (req, res) => {
  const num1 = parseFloat(req.query.num1);
  const num2 = parseFloat(req.query.num2);

  if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ error: 'Invalid numbers provided' });
  }

  const difference  = num1 - num2;
  res.json({ num1, num2, difference });
});


// Route for Multiplying two numbers (POST method)
app.post('/multiply', (req, res) => {
    const { num1, num2 } = req.body;

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Invalid numbers provided' });
    }

    const multiplication = num1 * num2;
    res.json({ num1, num2, multiplication });
});

// Route for Dividing two numbers (POST method)
app.post('/divide', (req, res) => {
  const { num1, num2 } = req.body;
  if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).json({ error: 'Invalid numbers provided' });
  }
  if (num2 === 0) {
      return res.status(400).json({ error: 'Division by zero is not allowed' });
  }
  const division = num1 / num2;
  res.json({ num1, num2, division });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
