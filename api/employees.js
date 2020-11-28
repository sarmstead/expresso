// This file handles logic for all routes starting with /api/employees/

// Import Express and create employees router
const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Export employeesRouter
module.exports = employeesRouter;