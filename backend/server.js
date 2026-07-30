const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;
let isCrashed = false;

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.status(isCrashed ? 500 : 200).json({ status: isCrashed ? 'error' : 'ok' });
});

app.post('/api/register', (req, res, next) => {
  try {
    if (req.body.crash === true) {
      isCrashed = true;
      next(new Error('FATAL: Intentional massive memory error to simulate a server crash'));
    } else {
      res.json({ success: true, message: 'Registered successfully' });
    }
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  isCrashed = true;
  console.error('Server crashed:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: err.stack
  });
  // do not call next() here to prevent further error handling
});

app.listen(port, () => {
  console.log(`Victim backend listening on port ${port}`);
});