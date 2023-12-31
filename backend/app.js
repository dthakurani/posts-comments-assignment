const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');

const { commonErrorHandler } = require('./utilities/errorHandler');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 50000,
  }),
);

// Enable cors support to accept cross origin requests
app.use(cors());
app.options('*', cors());

// Enable helmet js middlewares to configure secure headers
app.use(helmet());

// Enable gzip compression module for REST API
app.use(compression());

app.use('/health', (_req, res) => {
  res.send({ message: 'Application running successfully!' });
});

// REST API entry point
routes.registerRoutes(app);

// 404 Error Handling
app.use((req, res) => {
  const message = 'Invalid endpoint';
  commonErrorHandler(req, res, message, 404);
});

module.exports = app;
