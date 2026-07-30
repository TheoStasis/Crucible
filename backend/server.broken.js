const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Healthy endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Target endpoint with intentional bug
app.post('/api/register', (req, res, next) => {
  try {
    if (req.body.crash === true) {
      throw new Error('FATAL: Intentional massive memory error to simulate a server crash');
    }
    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server crashed:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: err.stack
  });
});

app.listen(port, () => {
  console.log(`Victim backend listening on port ${port}`);
});
