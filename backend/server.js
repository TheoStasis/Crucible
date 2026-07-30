const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

// Local error handler for /api/register
const registerErrorHandler = (err, req, res, next) => {
  if (err.message === 'Server has crashed due to request') {
    res.status(500).json({
      status: 'error',
      message: 'Server is in a crashed state',
    });
  } else if (err instanceof Error && [401, 400, 404, 500].includes(err.status)) {
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

// Global error handling middleware
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception at:', err.stack);
});

const globalErrorHandler = (err, req, res, next) => {
  let status = 500;
  if (err.status) {
    status = err.status;
  }

  res.status(status).json({
    status: 'error',
    message: err.message,
  });
};

// Healthy endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Target endpoint with bug fixed
app.post('/api/register', (req, res, next) => {
  try {
    if (req.body && req.body.crash === true && process.env.NODE_ENV !== 'development') {
      next(new Error({
        message: 'Server has crashed due to request',
        status: 500,
      }));
    }
    res.json({ success: true, message: 'Registered successfully' });
  } catch (err) {
    if (!err.status && !(err instanceof Error)) {
      err = {
        status: 500,
        message: 'Internal server error',
      };
    }
    registerErrorHandler(err, req, res, next);
  }
});

app.listen(port, () => {
  console.log(`Victim backend listening on port ${port}`);
});