const sqlite3 = require('sqlite3').verbose();
const path = require('node:path');

// Use /tmp for production (Render), local path for development
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction 
  ? '/tmp/database.sqlite'
  : path.join(__dirname, 'database', 'database.sqlite');

console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Database path: ${dbPath}`);

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err);
      } else {
        console.log('Connected to SQLite database');
        this.createTables();
      }
    });
  }

  createTables() {
    const sql = `
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        excerpt TEXT,
        url TEXT,
        published_date TEXT,
        source TEXT DEFAULT 'BeyondChats',
        is_updated BOOLEAN DEFAULT 0,
        parent_article_id INTEGER NULL,
        reference_urls TEXT,
        scraped_at TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_article_id) REFERENCES articles(id)
      )
    `;

    this.db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Articles table ready');
      }
    });
  }

  getAll(callback) {
    const sql = 'SELECT * FROM articles ORDER BY created_at DESC';
    this.db.all(sql, [], callback);
  }

  getById(id, callback) {
    const sql = 'SELECT * FROM articles WHERE id = ?';
    this.db.get(sql, [id], callback);
  }

  getLatest(callback) {
    const sql = 'SELECT * FROM articles WHERE is_updated = 0 ORDER BY created_at DESC LIMIT 1';
    this.db.get(sql, [], callback);
  }

  create(data, callback) {
    const sql = `
      INSERT INTO articles (
        title, content, excerpt, url, published_date, 
        source, is_updated, parent_article_id, reference_urls, scraped_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    this.db.run(
      sql,
      [
        data.title,
        data.content || '',
        data.excerpt || '',
        data.url || '',
        data.published_date || new Date().toISOString().split('T')[0],
        data.source || 'BeyondChats',
        data.is_updated || 0,
        data.parent_article_id || null,
        data.reference_urls || data.references || null,
        data.scraped_at || new Date().toISOString()
      ],
      function(err) {
        callback(err, this ? this.lastID : null);
      }
    );
  }

  update(id, data, callback) {
    const fields = [];
    const values = [];

    Object.keys(data).forEach(key => {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    values.push(id);
    const sql = `UPDATE articles SET ${fields.join(', ')}, updated_at = datetime('now') WHERE id = ?`;

    this.db.run(sql, values, function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  delete(id, callback) {
    const sql = 'DELETE FROM articles WHERE id = ?';
    this.db.run(sql, [id], function(err) {
      callback(err, this ? this.changes : 0);
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database();
