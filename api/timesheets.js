// This file handles logic for all routes starting with /api/employees/:employeeId/timesheets

// Import Express and create timesheets router
const express = require('express');
const timesheetsRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Export timesheetsRouter
module.exports = timesheetsRouter;