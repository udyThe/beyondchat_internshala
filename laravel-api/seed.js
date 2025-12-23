const fs = require('node:fs');
const path = require('node:path');
const database = require('./database');
const { runEnhancement } = require('./enhance');

console.log('Article Seeder - Importing scraped articles');
console.log('============================================\n');

// Read the scraped articles JSON file
const jsonFile = path.join(__dirname, '..', 'scraped_articles.json');

if (!fs.existsSync(jsonFile)) {
  console.error('Error: scraped_articles.json not found!');
  process.exit(1);
}

const articlesData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

console.log(`Found ${articlesData.length} articles to import\n`);

// Wait for database to be ready before seeding
setTimeout(() => {
  let completed = 0;
  let failed = 0;

  articlesData.forEach((data, index) => {
    database.create(data, (err, id) => {
      if (err) {
        console.error(`✗ Error importing article: ${err.message}`);
        failed++;
      } else {
        console.log(`✓ Imported: ${data.title} (ID: ${id})`);
        completed++;
      }
      
      // Check if all articles have been processed
      if (completed + failed === articlesData.length) {
        console.log(`\n✓ Seeding completed! (${completed} successful, ${failed} failed)`);
        
        // Run demo-enhancement to create optimized versions
        console.log('\n📝 Running demo enhancement...');
        const enhancement = spawn('node', ['../nodejs-script/demo-enhancement.js'], { 
          stdio: 'inherit',
          cwd: __dirname 
        });
        
        enhancement.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Demo enhancement completed!');
          } else {
            console.log('⚠️  Demo enhancement failed, but continuing...');
          }
          process.exit(0);
        });
      }
    });
  });
}, 1000); // Wait 1 second for table creation

// Timeout after 30 seconds (increased for enhancement)
setTimeout(() => {
  console.log('\nTimeout - exiting seeder');
  process.exit(0);
}, 30000);
