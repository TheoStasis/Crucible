const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

let isCrashed = false;

// Middleware
app.use(express.json());
app.use(cors());

// Route not found middleware
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  if (isCrashed) {
    res.status(500).json({ status: 'error', message: 'Server is in crashed state', stack: err.stack });
  } else {
    res.status(500).json({ error: 'Internal Server Error', message: err.message, stack: err.stack });
  }
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: isCrashed ? 'crashed' : 'ok' });
});

// Target endpoint with intentional bug
app.post('/api/register', (req, res, next) => {
  try {
    if (req.body.crash === true) {
      throw new Error('FATAL: Intentional massive memory error to simulate a server crash');
    }
    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    isCrashed = true;
    console.error('Server crashed:', err.stack);
    res.status(418).send({ status: 'error', message: 'Server crashed. Please retry later.' });
  }
});

app.listen(port, () => {
  console.log(`Victim backend listening on port ${port}`);
});