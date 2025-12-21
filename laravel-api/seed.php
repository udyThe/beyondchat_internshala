<?php
require_once __DIR__ . '/app/Models/Article.php';

echo "Article Seeder - Importing scraped articles\n";
echo "============================================\n\n";

// Read the scraped articles JSON file
$jsonFile = __DIR__ . '/../scraped_articles.json';

if (!file_exists($jsonFile)) {
    die("Error: scraped_articles.json not found!\n");
}

$articlesData = json_decode(file_get_contents($jsonFile), true);

if (!$articlesData) {
    die("Error: Could not parse JSON file!\n");
}

$article = new Article();

echo "Found " . count($articlesData) . " articles to import\n\n";

foreach ($articlesData as $index => $data) {
    try {
        $id = $article->create([
            'title' => $data['title'],
            'content' => $data['content'],
            'excerpt' => $data['excerpt'] ?? '',
            'url' => $data['url'],
            'published_date' => $data['published_date'] ?? date('Y-m-d'),
            'source' => $data['source'] ?? 'BeyondChats',
            'is_updated' => 0,
            'parent_article_id' => null,
            'references' => null,
            'scraped_at' => $data['scraped_at']
        ]);
        
        echo "✓ Imported: " . $data['title'] . " (ID: $id)\n";
    } catch (Exception $e) {
        echo "✗ Error importing article: " . $e->getMessage() . "\n";
    }
}

echo "\n✓ Seeding completed!\n";
