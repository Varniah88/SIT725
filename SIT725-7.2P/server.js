const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { seedCards } = require('./collections/cardsCollections');
const cardRoutes = require('./routes/cardRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cartRoutes = require('./routes/cartRoutes');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/sustainableFashionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  seedCards(); // seed after DB connection
})
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/cards', cardRoutes);
app.use('/', contactRoutes);
app.use('/cart', cartRoutes);

// Static Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit a welcome message to the connected client
  socket.emit('message', 'Welcome to Earthly Threads!');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = server;