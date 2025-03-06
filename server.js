const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const db = new sqlite3.Database('contacts.db');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, email TEXT)');
});

app.get('/api/contacts', (req, res) => {
	db.all('SELECT * FROM contacts', [], (err, rows) => {
		if (err) {
			throw err;
		}
		res.json(rows);
	});
});

app.post('/api/contacts', (req, res) => {
	const { name, phone, email } = req.body;
	const stmt = db.prepare('INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)');
	stmt.run(name, phone, email, function (err) {
		if (err) {
			res.status(500).send('Error inserting contact');
		} else {
			res.status(201).json({ id: this.lastID, name, phone, email });
		}
	});
	stmt.finalize();
});

app.delete('/api/contacts/:id', (req, res) => {
	const { id } = req.params;
	const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
	stmt.run(id, function (err) {
		if (err) {
			res.status(500).send('Error deleting contact');
		} else {
			res.status(200).send('Contact deleted');
		}
	});
	stmt.finalize();
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
