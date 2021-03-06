// This file handles logic for all routes starting with /api/menus/:menuId/menu-items

// Import Express and SQlite3, and create menuItems router
const express = require('express');
const menuItemsRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
    const menuItemsParamSql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
    const menuItemsParamValues = {$menuItemId: menuItemId};

    db.get(menuItemsParamSql, menuItemsParamValues, (err, menuItem) => {
        if (err) {
            next(err);
        } else if (menuItem) {
            req.menuItem = menuItem;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

menuItemsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`, (err, menuItems) => {
        if (err) {
            next(err);
        }
        res.status(200).json({menuItems: menuItems});
    });
});

menuItemsRouter.post('/', (req, res, next) => {
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.params.menuId;

    if (!name || !description || !inventory || !price || !menuId) {
        res.sendStatus(400);
        return next();
    }

    const menuItemsSql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';
    const menuItemsValues = {
        $name: name, 
        $description: description, 
        $inventory: inventory, 
        $price: price, 
        $menuId: menuId
    };

    db.run(menuItemsSql, menuItemsValues, function(err) {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (err2, menuItem) => {
            if (err2) {
                next(err2);
            }
            res.status(201).json({menuItem: menuItem});
        })
    })
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
    const menuItemId = req.params.menuItemId;
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    const menuId = req.params.menuId;

    if (!name || !description || !inventory || !price || !menuId || !menuItemId) {
        res.sendStatus(400);
        return next();
    }
    
    const menuItemsSql = 'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE MenuItem.id = $menuItemId';
    const menuItemsValues = {
        $name: name, 
        $description: description, 
        $inventory: inventory, 
        $price: price, 
        $menuId: menuId,
        $menuItemId: menuItemId
    };

    db.run(menuItemsSql, menuItemsValues, (err) => {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${menuItemId}`, (err2, menuItem) => {
            if(err2) {
                next(err2);
            }
            res.status(200).json({menuItem: menuItem});
        });
    });
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
    db.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`, (err) => {
        if (err) {
            next(err);
        }
        res.sendStatus(204);
    });
});

// Export menuItemsRouter
module.exports = menuItemsRouter;