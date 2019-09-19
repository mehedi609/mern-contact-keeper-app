const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const users = require('./routes/users');
const contacts = require('./routes/contacts');
const auth = require('./routes/auth');

const app = express();

// Connect DB
connectDB();

// Init Middleware
console.log(`Environment: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    msg: 'Welcome to the contact keeper API...'
  });
});

// Define Routes
app.use('/api/users', users);
app.use('/api/contacts', contacts);
app.use('/api/auth', auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}...`));
