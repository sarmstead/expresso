// This file handles logic for all routes starting with /api/employees/

// Import Express and create employees router
const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Param for /:employeeId
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
    const sql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
    const values = { $employeeId: employeeId };
    db.get(sql, values, (err, employee) => {
        if (err) {
            next(err);
        } else if (employee) {
            req.employee = employee;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

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
        return next();
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

employeesRouter.get('/:employeeId', (req, res, next) => {
    const sql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
    const values = { $employeeId: req.params.employeeId };
    db.get(sql, values, (err, employee) => {
        if (err) {
            next(err);
        } else {
            res.status(200).json({ employee: employee });
        }
    });
});

employeesRouter.put('/:employeeId', (req, res, next) => {
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    if (!name || !position || !wage) {
        res.sendStatus(400);
        return next();
    }

    const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

    const sql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId';
    const values = {
        $employeeId: req.params.employeeId,
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee
    };
    
    db.run(sql, values, (err) => {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (err2, employee) => {
            res.status(200).json({employee: employee});
        });
    });
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
    const sql = `UPDATE Employee SET is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId`;
    const values = {
        $employeeId: req.params.employeeId,
        $isCurrentEmployee: 0
    };
    db.run(sql, values, (err) => {
        if (err) {
            next(err);
        }
        db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`, (err2, employee) => {
            res.status(200).json({employee: employee});
        });
    });
});

// Export employeesRouter
module.exports = employeesRouter;