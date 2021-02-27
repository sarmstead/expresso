// This file handles logic for all routes starting with /api/menus/:menuId/menu-items

// Import Express and SQlite3, and create menuItems router
const express = require('express');
const menuItemsRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');