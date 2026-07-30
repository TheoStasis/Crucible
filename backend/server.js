const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = 3001;

app.use(cors());
app.use(
  helmet({
    frameguard: false,
  })
);

// Uncaught exception and unhandled rejection handlers
process.on('uncaughtException', (err) => {
  console.error("Uncaught exception at:", err.stack);
  process.exit(1); // exit with non-zero code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled rejection at:", promise, "reason:", reason);
  process.exit(1); // exit with non-zero code
});

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  let status = 500;
  if (
    err &&
    err.status &&
    (400 <= err.status &&
      err.status < 600)
  ) {
    status = err.status;
  }

  if (res.headersSent) {
    return next(err); // pass the error to the next middleware
  }

  res.status(status).json({
    status: 'error',
    message: err.message
  });
  res.end(); // ensure response ends
  next(); // not required here as response has been sent
};

// Health endpoint
app.get('/api/health', (req, res, next) => {
  try {
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

// Target endpoint
app.post('/api/register', (req, res, next) => {
  try {
    if (req.body && 'crash' in req.body && req.body.crash === true) {
      throw new Error('Test crash');
    } else {
      res.status(200).json({ success: true, message: 'Registered successfully' });
      res.end(); // ensure response ends
    }
  } catch (err) {
    next(err); // pass the error to the global error handler
  }
});

app.use(globalErrorHandler);

// Not found handler
app.use((req, res, next) => {
  if (res.headersSent) {
    return next(); // if headers have been sent, don't send another response
  }
  res.status(404).json({
    status: 'error',
    message: 'Page not found'
  });
  res.end(); // ensure response ends
  next();
});

// Ensure next() is always called in the catch block
app.use((err, req, res, next) => { // note the changed parameters
  res.status(500).json({
    status: 'error',
    message: 'An internal server error occurred.'
  });
  res.end(); // ensure response ends
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});