// This file handles logic for all routes starting with /api/menus/

// Import Express and SQlite3, and create menus router
const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Import menuItems router to append to api/menus router
const menuItemsRouter = require('./menu-items');

menusRouter.param('menuId', (req, res, next, menuId) => {
    const menuParamSql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
    const menuParamValues = {$menuId: menuId};

    db.get(menuParamSql, menuParamValues, (err, menu) => {
        if (err) {
            next(err);
        } else if (menu) {
            req.menu = menu;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

menusRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', (err, menus) => {
        if (err) {
            next(err);
        }
        res.status(200).json({menus: menus});
    });
});

menusRouter.post('/', (req, res, next) => {
    const title = req.body.menu.title;
    if (!title) {
        res.sendStatus(400);
        return next();
    }

    const menuSql = 'INSERT INTO Menu (title) VALUES ($title)';
    const menuValues = {$title: title};

    db.run(menuSql, menuValues, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (err2, menu) => {
                if (err2) {
                    next(err2);
                }
                res.status(201).json({menu: menu});
            });
        }
    });
});

menusRouter.get('/:menuId', (req, res, next) => {
    db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (err, menu) => {
        if (err) {
            next(err);
        }
        res.status(200).json({menu: menu});
    });
});

menusRouter.put('/:menuId', (req, res, next) => {
    const title = req.body.menu.title;
    const menuId = req.params.menuId;

    if (!title) {
        res.sendStatus(400);
        return next();
    }

    const menuSql = 'UPDATE Menu SET title = $title WHERE Menu.id = $menuId';
    const menuValues = {
        $title: title,
        $menuId: menuId
    };

    db.run(menuSql, menuValues, (err) => {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`, (err2, menu) => {
            if (err2) {
                next(err2);
            }
            res.status(200).json({menu: menu});
        });
    });


});

menusRouter.delete('/:menuId', (req, res, next) => {
    db.all(`SELECT id FROM MenuItem WHERE MenuItem.menu_id = ${req.params.menuId}`, function (err, menuItems) {
        if (err) {
            next(err);
        } else if (menuItems.length > 0) {
            res.sendStatus(400);
            return next();
        } else {
            db.run(`DELETE FROM Menu WHERE Menu.id = ${req.params.menuId}`, (err2) => {
                if (err2) {
                    next(err2);
                }
                res.sendStatus(204);
            });
        }
    });
    
});

// Mount menuItemsRouter router
menusRouter.use('/:menuId/menu-items', menuItemsRouter);

// Export menusRouter
module.exports = menusRouter;