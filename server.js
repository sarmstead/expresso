// Import Express
const express = require('express');
const app = express();

// Import API router
const apiRouter = require('./api/api');

// Import additional middleware
const cors = require('cors');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

// Use additional middleware for every route
app.use(cors());
app.use(bodyParser.json());
app.use(errorhandler());
app.use(morgan('dev'));

// Mount api router for all routes starting with '/api'
app.use('/api', apiRouter);

// Set PORT variable
const PORT = process.env.PORT || 4000;

// Start server 
app.listen(PORT, () => {
    console.log(`Server now listening on PORT: ${PORT} ...`);
});

// Export Express app
module.exports = app;