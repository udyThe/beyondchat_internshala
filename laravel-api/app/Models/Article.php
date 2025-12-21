<?php
// Simple Database Class using PDO
class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $dbPath = __DIR__ . '/../database/database.sqlite';
        
        // Create database directory if it doesn't exist
        $dbDir = dirname($dbPath);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0777, true);
        }
        
        // Create database file if it doesn't exist
        if (!file_exists($dbPath)) {
            touch($dbPath);
        }
        
        try {
            $this->pdo = new PDO("sqlite:$dbPath");
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->createTables();
        } catch (PDOException $e) {
            die("Database connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->pdo;
    }

    private function createTables() {
        $sql = "CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT,
            excerpt TEXT,
            url TEXT,
            published_date TEXT,
            source TEXT DEFAULT 'BeyondChats',
            is_updated BOOLEAN DEFAULT 0,
            parent_article_id INTEGER NULL,
            references TEXT,
            scraped_at TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        $this->pdo->exec($sql);
    }
}

class Article {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM articles ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM articles WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    
    public function create($data) {
        $sql = "INSERT INTO articles (title, content, excerpt, url, published_date, source, is_updated, parent_article_id, references, scraped_at, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['title'] ?? '',
            $data['content'] ?? '',
            $data['excerpt'] ?? '',
            $data['url'] ?? '',
            $data['published_date'] ?? date('Y-m-d'),
            $data['source'] ?? 'BeyondChats',
            $data['is_updated'] ?? 0,
            $data['parent_article_id'] ?? null,
            $data['references'] ?? null,
            $data['scraped_at'] ?? date('c')
        ]);
        
        return $this->db->lastInsertId();
    }
    
    public function update($id, $data) {
        $fields = [];
        $values = [];
        
        foreach ($data as $key => $value) {
            if ($key !== 'id') {
                $fields[] = "$key = ?";
                $values[] = $value;
            }
        }
        
        $values[] = $id;
        $sql = "UPDATE articles SET " . implode(', ', $fields) . ", updated_at = datetime('now') WHERE id = ?";
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($values);
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM articles WHERE id = ?");
        return $stmt->execute([$id]);
    }
    
    public function getLatest() {
        $stmt = $this->db->query("SELECT * FROM articles WHERE is_updated = 0 ORDER BY created_at DESC LIMIT 1");
        return $stmt->fetch();
    }
}
