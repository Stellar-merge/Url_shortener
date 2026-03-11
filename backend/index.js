const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./urls.db', (err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_url TEXT NOT NULL,
        short_url TEXT NOT NULL UNIQUE
      )
    `);
  }
});

// Helper to generate a random string
const generateShortId = () => {
  // Use base64url encoding to ensure URL-safe characters
  return crypto.randomBytes(4).toString('base64url').substring(0, 6);
};

// Application routes
app.post('/api/shorten', (req, res) => {
  const { originalUrl } = req.body;
  
  if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
    return res.status(400).json({ error: 'Valid URL is required (must start with http:// or https://)' });
  }

  // Generate short ID
  const shortId = generateShortId();

  db.run(`INSERT INTO urls (original_url, short_url) VALUES (?, ?)`, [originalUrl, shortId], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create short URL' });
    }
    
    res.json({
      originalUrl,
      shortUrl: `http://localhost:${PORT}/${shortId}`
    });
  });
});

    /*

      INSERT INTO urls (original_url, short_url) VALUES (?, ?): This is the SQL command. It says "add a new row into the urls table, and set the values for the original_url and short_url columns".

      [originalUrl, shortId]: Instead of putting the variables directly into the SQL string (which is a security risk), we use completely safe ? placeholders. This array provides the actual values that will safely replace those ? symbols.

      function(err) {: This is a "callback function". It tells the application what to do after the database finishes trying to save the data.

    */

// Redirect route
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;

  db.get(`SELECT original_url FROM urls WHERE short_url = ?`, [shortId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    
    if (row) {
      res.redirect(row.original_url);
    } else {
      res.status(404).send(`
        <html>
          <head>
            <title>404 Not Found</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding-top: 50px; background: #f0f2f5; }
              h1 { color: #333; }
              p { color: #666; }
              a { color: #1a73e8; text-decoration: none; }
            </style>
          </head>
          <body>
            <h1>404 - URL Not Found</h1>
            <p>The shortened URL you are looking for does not exist.</p>
            <a href="/">Go to Homepage</a>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
