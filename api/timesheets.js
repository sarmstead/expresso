// This file handles logic for all routes starting with /api/employees/:employeeId/timesheets

// Import Express and create timesheets router
const express = require('express');
const timesheetsRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Export timesheetsRouter
module.exports = timesheetsRouter;

timesheetsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId';
    const values = { $employeeId: req.params.employeeId };
    db.all(sql, values, (err, timesheets) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({timesheets: timesheets});
        }
    });
});