require('dotenv').config();
const APIClient = require('./apiClient');
const { searchGoogle, scrapeArticleContent } = require('./googleSearch');
const ArticleOptimizer = require('./articleOptimizer');

/**
 * Main workflow for article optimization
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  BeyondChats Article Optimization Script');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Step 1: Initialize API client
    const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8000';
    const apiClient = new APIClient(apiBaseUrl);
    console.log(`✓ Connected to API: ${apiBaseUrl}\n`);

    // Step 2: Fetch the latest article from the API
    console.log('📥 Fetching latest article from API...');
    const latestArticle = await apiClient.getLatestArticle();
    
    if (!latestArticle) {
      console.log('❌ No articles found to optimize!');
      return;
    }

    console.log(`✓ Found article: "${latestArticle.title}"`);
    console.log(`  ID: ${latestArticle.id}`);
    console.log(`  Source: ${latestArticle.source}`);
    console.log(`  Published: ${latestArticle.published_date}`);

    // Step 3: Search Google for the article title
    const searchResults = await searchGoogle(latestArticle.title);

    if (searchResults.length === 0) {
      console.log('❌ No search results found!');
      return;
    }

    // Step 4: Scrape content from the top 2 results
    console.log('\n📚 Scraping reference articles...');
    const referenceArticles = [];

    for (const result of searchResults) {
      const content = await scrapeArticleContent(result.url);
      referenceArticles.push({
        url: result.url,
        title: result.title,
        content: content
      });
      
      // Be respectful with scraping - add delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✓ Scraped ${referenceArticles.length} reference articles`);

    // Step 5: Use LLM to optimize the article
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const optimizer = new ArticleOptimizer(openaiApiKey);
    
    const optimizedArticle = await optimizer.optimizeArticle(latestArticle, referenceArticles);
    console.log('✓ Article optimized successfully!');

    // Step 6: Publish the optimized article via API
    console.log('\n📤 Publishing optimized article...');
    const publishResult = await apiClient.createArticle(optimizedArticle);
    console.log(`✓ Published! New article ID: ${publishResult.id}`);

    // Step 7: Mark the original article as updated
    await apiClient.updateArticle(latestArticle.id, { is_updated: 1 });
    console.log('✓ Original article marked as updated');

    // Summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  ✅ WORKFLOW COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\nOriginal Article: ${latestArticle.title}`);
    console.log(`Optimized Article: ${optimizedArticle.title}`);
    console.log(`\nReferences Used:`);
    referenceArticles.forEach((ref, idx) => {
      console.log(`  ${idx + 1}. ${ref.title}`);
      console.log(`     ${ref.url}`);
    });
    console.log('\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
