const express = require('express');
const users = require('./routes/users');
const contacts = require('./routes/contacts');
const auth = require('./routes/auth');

const app = express();

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
