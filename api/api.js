// Initialize top-level API router '/api/*'
const express = require('express');
const apiRouter = express.Router();

// Import additional routers to append to API router
const employeesRouter = require('./employees');

// Mount additional routers
apiRouter.use('/employees', employeesRouter);

// Export apiRouter
module.exports = apiRouter;