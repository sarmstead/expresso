// This file handles logic for all routes starting with /api/menus/:menuId/menu-items

// Import Express and SQlite3, and create menuItems router
const express = require('express');
const menuItemsRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`, (err, menuItems) => {
        if (err) {
            next(err);
        }
        res.status(200).json({menuItems: menuItems});
    });
});

// Export menuItemsRouter
module.exports = menuItemsRouter;