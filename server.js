// Express Server
const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const app = express();
const db = require('./db/connection');
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect the routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

db.connect((err) => {
	if (err) throw err;
	console.log('Database connected.');
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
});
