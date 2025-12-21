require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'BeyondChats Article Management API',
    version: '1.0',
    endpoints: {
      'GET /articles': 'Get all articles',
      'GET /articles/:id': 'Get a specific article',
      'GET /articles/latest': 'Get the latest unupdated article',
      'POST /articles': 'Create a new article',
      'PUT /articles/:id': 'Update an article',
      'DELETE /articles/:id': 'Delete an article'
    }
  });
});

// Get all articles
app.get('/articles', (req, res) => {
  database.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Get latest article
app.get('/articles/latest', (req, res) => {
  database.getLatest((err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'No articles found' });
    }
    res.json({ success: true, data: row });
  });
});

// Get article by ID
app.get('/articles/:id', (req, res) => {
  const id = req.params.id;
  
  database.getById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, data: row });
  });
});

// Create new article
app.post('/articles', (req, res) => {
  const data = req.body;
  
  if (!data.title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  
  database.create(data, (err, id) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ success: true, message: 'Article created', id });
  });
});

// Update article
app.put('/articles/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  
  database.update(id, data, (err, changes) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, message: 'Article updated' });
  });
});

// Delete article
app.delete('/articles/:id', (req, res) => {
  const id = req.params.id;
  
  database.delete(id, (err, changes) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (changes === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, message: 'Article deleted' });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ API Documentation: http://localhost:${PORT}\n`);
});
