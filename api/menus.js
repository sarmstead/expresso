// This file handles logic for all routes starting with /api/menus/

// Import Express and SQlite3, and create menus router
const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Export menusRouter
module.exports = menusRouter;