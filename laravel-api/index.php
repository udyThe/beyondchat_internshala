<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/app/Models/Article.php';

// Get the request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/index.php', '', $path);
$path = trim($path, '/');

// Parse the path
$parts = explode('/', $path);
$resource = $parts[0] ?? '';
$id = $parts[1] ?? null;

$article = new Article();

try {
    switch ($resource) {
        case 'api':
        case 'articles':
            handleArticles($method, $id, $article);
            break;
        default:
            // Show API documentation
            echo json_encode([
                'message' => 'BeyondChats Article Management API',
                'version' => '1.0',
                'endpoints' => [
                    'GET /articles' => 'Get all articles',
                    'GET /articles/{id}' => 'Get a specific article',
                    'GET /articles/latest' => 'Get the latest article',
                    'POST /articles' => 'Create a new article',
                    'PUT /articles/{id}' => 'Update an article',
                    'DELETE /articles/{id}' => 'Delete an article'
                ]
            ], JSON_PRETTY_PRINT);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleArticles($method, $id, $article) {
    switch ($method) {
        case 'GET':
            if ($id === 'latest') {
                $data = $article->getLatest();
                if ($data) {
                    echo json_encode(['success' => true, 'data' => $data]);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'No articles found']);
                }
            } elseif ($id) {
                $data = $article->getById($id);
                if ($data) {
                    echo json_encode(['success' => true, 'data' => $data]);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Article not found']);
                }
            } else {
                $data = $article->getAll();
                echo json_encode(['success' => true, 'data' => $data, 'count' => count($data)]);
            }
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
                return;
            }
            
            $newId = $article->create($input);
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Article created', 'id' => $newId]);
            break;
            
        case 'PUT':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Article ID required']);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
                return;
            }
            
            $result = $article->update($id, $input);
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Article updated']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Article not found']);
            }
            break;
            
        case 'DELETE':
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Article ID required']);
                return;
            }
            
            $result = $article->delete($id);
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Article deleted']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Article not found']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
}
