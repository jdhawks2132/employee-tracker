const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all employees
router.get('/employees', (req, res) => {
	const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON manager.id = employees.manager_id`;
	const params = [];
	db.query(sql, params, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: rows,
		});
	});
});

// Get a single employee
router.get('/employee/:id', (req, res) => {
	const sql = `SELECT * FROM employees WHERE id = ?`;
	const params = [req.params.id];
	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: row,
		});
	});
});

// Create an employee
router.post('/employee', ({ body }, res) => {
	const errors = inputCheck(
		body,
		'first_name',
		'last_name',
		'role_id',
		'manager_id'
	);
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}
	const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
	const params = [
		body.first_name,
		body.last_name,
		body.role_id,
		body.manager_id,
	];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: body,
		});
	});
});

// Update an employee role
router.put('/employee/role/:id', (req, res) => {
	const errors = inputCheck(req.body, 'role_id');
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}
	const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
	const params = [req.body.role_id, req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			// check if a record was found
		} else if (!result.affectedRows) {
			res.json({
				message: 'Employee not found',
			});
		} else {
			res.json({
				message: 'success',
				data: req.body,
				changes: result.affectedRows,
			});
		}
	});
});

// Update an employee manager
router.put('/employee/manager/:id', (req, res) => {
	const errors = inputCheck(req.body, 'manager_id');
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}
	const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
	const params = [req.body.manager_id, req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			// check if a record was found
		} else if (!result.affectedRows) {
			res.json({
				message: 'Employee not found',
			});
		} else {
			res.json({
				message: 'success',
				data: req.body,
				changes: result.affectedRows,
			});
		}
	});
});

// Delete an employee
router.delete('/employee/:id', (req, res) => {
	const sql = `DELETE FROM employees WHERE id = ?`;
	const params = [req.params.id];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: res.message });
		} else if (!result.affectedRows) {
			res.json({
				message: 'Employee not found',
			});
		} else {
			res.json({
				message: 'deleted',
				changes: result.affectedRows,
				id: req.params.id,
			});
		}
	});
});

module.exports = router;
