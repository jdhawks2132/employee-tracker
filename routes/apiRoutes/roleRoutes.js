const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all roles
router.get('/roles', (req, res) => {
	// sql returns job title, role id, the department that role belongs to, and the salary for that role
	const sql = `SELECT roles.id, roles.title, departments.name AS department, roles.salary
  FROM roles
  LEFT JOIN departments ON roles.department_id = departments.id`;
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

// Get a single role
router.get('/role/:id', (req, res) => {
	const sql = `SELECT * FROM roles WHERE id = ?`;
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

// Create a role
router.post('/role', ({ body }, res) => {
	const errors = inputCheck(body, 'title', 'salary', 'department_id');
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}
	const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
	const params = [body.title, body.salary, body.department_id];
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

// Update a role
router.put('/role/:id', (req, res) => {
	const errors = inputCheck(req.body, 'title', 'salary', 'department_id');
	if (errors) {
		res.status(400).json({ error: errors });
		return;
	}
	const sql = `UPDATE roles SET title = ?, salary = ?, department_id = ? WHERE id = ?`;
	const params = [
		req.body.title,
		req.body.salary,
		req.body.department_id,
		req.params.id,
	];
	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		} else if (!result.affectedRows) {
			res.json({
				message: 'Role not found',
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

// Delete a role
router.delete('/role/:id', (req, res) => {
	const sql = `DELETE FROM roles WHERE id = ?`;
	db.query(sql, req.params.id, (err, result) => {
		if (err) {
			res.status(400).json({ error: res.message });
		} else if (!result.affectedRows) {
			res.json({
				message: 'Role not found',
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
