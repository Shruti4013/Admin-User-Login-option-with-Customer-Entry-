const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');  // Ensure we are using mysql2

const app = express();

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aditya123',
  database: 'aip_project'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    throw err;
  }
  console.log('Connected to MySQL database!');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve login form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  console.log("Trying to login with:", username, password, role); // Debug

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?',
    [username, password, role],
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        req.session.user = results[0];
        res.redirect('/customer.html');
      } else {
        res.send('Invalid credentials or role!');
      }
    }
  );
});

// Get all customers (for use in frontend if needed)
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add customer
app.post('/add-customer', (req, res) => {
  const { name, phone, address, dues } = req.body;
  db.query(
    'INSERT INTO customers (name, phone, address, dues) VALUES (?, ?, ?, ?)',
    [name, phone, address, dues],
    (err) => {
      if (err) throw err;
      res.redirect('/customer.html');
    }
  );
});

// Update customer
app.post('/update-customer', (req, res) => {
  const { id, name, phone, address, dues } = req.body;
  db.query(
    'UPDATE customers SET name = ?, phno = ?, address = ?, dues = ? WHERE id = ?',
    [name, phone, address, dues, id],
    (err) => {
      if (err) throw err;
      res.redirect('/customer.html');
    }
  );
});

// Delete customer
app.post('/delete-customer', (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM customers WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/customer.html');
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
