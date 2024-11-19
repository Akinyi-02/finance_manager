const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory "database" (for testing purposes)
let users = [];

// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Hash the password before saving it
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user (in-memory for now)
    users.push({ username, password: hashedPassword });

    // Send success response
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error hashing password' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Find the user in the "database"
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Compare the provided password with the stored hash
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // Send the token as a response
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error comparing passwords' });
  }
});

// Dashboard endpoint (protected route)
app.get('/api/dashboard', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const username = decoded.username;

    // Example data (replace with actual data from your database)
    const userData = {
      username,
      totalIncome: 5000,
      totalExpenses: 2000,
      balance: 3000,
    };

    res.json(userData);
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
