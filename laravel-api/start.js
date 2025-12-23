const { spawn } = require('child_process');
const db = require('./database');

async function startServer() {
  try {
    // Check if database has articles
    const articles = await new Promise((resolve, reject) => {
      db.getAll((err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
    
    if (articles.length === 0) {
      console.log('📦 Database is empty. Running seed script...');
      
      // Run seed script
      const seed = spawn('node', ['seed.js'], { stdio: 'inherit' });
      
      await new Promise((resolve, reject) => {
        seed.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Seed completed successfully');
            resolve();
          } else {
            reject(new Error(`Seed failed with code ${code}`));
          }
        });
      });
    } else {
      console.log(`✅ Database already has ${articles.length} articles`);
    }
    
    // Start the server
    console.log('🚀 Starting server...');
    require('./server.js');
    
  } catch (error) {
    console.error('❌ Startup error:', error.message);
    process.exit(1);
  }
}

startServer();
