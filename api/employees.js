// This file handles logic for all routes starting with /api/employees/

// Import Express and create employees router
const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


employeesRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Employee WHERE is_current_employee = 1', (err, employees) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({ employees: employees });
        }
    });
});

employeesRouter.post('/', (req, res, next) => {
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isCurrentEmployee = (req.body.employee.isCurrentEmployee = 0) ? 0 : 1;
    const sql = 'INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)';
    values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee
    };

    if (!name || !position || !wage || !isCurrentEmployee) {
        res.sendStatus(400);
    }

    db.run(sql, values, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (err2, employee) => {
                if (err2) {
                    next(err2);
                } else {
                    res.status(201).json({ employee: employee });
                }
            });
        }
    });
});

// Export employeesRouter
module.exports = employeesRouter;