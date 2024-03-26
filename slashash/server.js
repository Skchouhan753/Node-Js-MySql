// server.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'movie_app_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL');
    return;
  }
  console.log('Connected to MySQL');
});

// Routes
app.get('/', (req, res) => {
  res.send('Movie App Backend');
});

// API Integration - OMDB
const OMDB_API_KEY = '721fecbb';
const OMDB_API_URL = 'http://www.omdbapi.com/';

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(OMDB_API_URL, {
      params: {
        apikey: OMDB_API_KEY,
        s: query,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Add to Favorites
app.post('/api/favorites', (req, res) => {
    const { movieId } = req.body;
    const userId = 1; // For simplicity, hardcoding user ID
  
    db.query(
      'INSERT INTO Favorites (userId, movieId) VALUES (?, ?)',
      [userId, movieId],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ success: true });
        }
      }
    );
  });
  
  // GET - Get Favorites
  app.get('/api/favorites', (req, res) => {
    const userId = 1; // For simplicity, hardcoding user ID
  
    db.query(
      'SELECT * FROM Favorites WHERE userId = ?',
      [userId],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(results);
        }
      }
    );
  });
  
  // DELETE - Remove from Favorites
  app.delete('/api/favorites/:id', (req, res) => {
    const { id } = req.params;
  
    db.query(
      'DELETE FROM Favorites WHERE id = ?',
      [id],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({ success: true });
        }
      }
    );
  });
  


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
