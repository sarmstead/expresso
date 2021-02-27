// This file handles logic for all routes starting with /api/employees/:employeeId/timesheets

// Import Express and create timesheets router
const express = require('express');
const timesheetsRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Export timesheetsRouter
module.exports = timesheetsRouter;

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
    const timesheetParamsSql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId';
    const timesheetParamsValues = { $timesheetId: timesheetId };
    db.get(timesheetParamsSql, timesheetParamsValues, (err, timesheet) => {
        if (err) {
            next(err);
        } else if (timesheet) {
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

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

timesheetsRouter.post('/', (req, res, next) => {
     const hours = req.body.timesheet.hours;
     const rate = req.body.timesheet.rate;
     const date = req.body.timesheet.date;
     const employeeId = req.params.employeeId;

     const employeeSql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId';
     const employeeValues = { $employeeId: employeeId };
    
     // Determine if employee exists
     db.get(employeeSql, employeeValues, (err, employee) => {
         // Handle error if there is an issue querying database
         if (err) {
             next(err);
         } else {
             // Throw 400 error code if required data is not sent in req.body.timesheet
             if (!hours || !rate || !date || !employeeId) {
                 return res.sendStatus(400);
             }
             const timesheetSql = 'INSERT INTO Timesheet (id, hours, rate, date, employee_id) VALUES ($id, $hours, $rate, $date, $employeeId)';
             const timesheetValues = {
                $id: req.params.timesheetId, 
                $hours: hours, 
                $rate: rate, 
                $date: date, 
                $employeeId: employeeId
             };
             // If there are no errors querying specified employee, insert their timesheet into database
             db.run(timesheetSql, timesheetValues, function(err2) {
                 if (err2) {
                     next(err2);
                 }
                 // If there are no errors inserting timesheet into database, fetch the newly created timesheet to return as a JSON object
                 db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (err3, timesheet) => {
                     if (err3) {
                         next(err3);
                     }
                     res.status(201).json({ timesheet: timesheet });
                 });
             });
         }
     });
});