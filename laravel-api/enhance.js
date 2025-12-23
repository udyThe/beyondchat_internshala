const database = require('./database');

// Simple enhancement templates for demo
const enhancements = {
  'AI': {
    additions: [
      '\n\n## Key Takeaways\n- AI technology is rapidly evolving in healthcare\n- Integration requires careful consideration of privacy and ethics\n- Human oversight remains crucial for patient safety',
      '\n\n## Future Implications\nAs AI continues to advance, we can expect to see more sophisticated applications in medical diagnosis, treatment planning, and patient care coordination.',
    ],
    references: [
      'https://www.nejm.org/ai-in-medicine',
      'https://www.healthit.gov/ai-healthcare'
    ]
  },
  'Healthcare': {
    additions: [
      '\n\n## Expert Insights\nHealthcare professionals emphasize the importance of balancing technological innovation with patient-centered care.',
      '\n\n## Industry Trends\nRecent studies show increasing adoption of AI tools in clinical settings, with promising results in diagnostic accuracy.',
    ],
    references: [
      'https://www.who.int/healthcare-ai',
      'https://www.cdc.gov/health-innovation'
    ]
  },
  'Medicine': {
    additions: [
      '\n\n## Clinical Applications\nMedical AI systems are being deployed for drug discovery, personalized treatment plans, and predictive analytics.',
      '\n\n## Safety Considerations\nRegulatory bodies are establishing frameworks to ensure AI medical tools meet rigorous safety standards.',
    ],
    references: [
      'https://www.fda.gov/medical-ai',
      'https://www.ama-assn.org/ai-medicine'
    ]
  },
  'website': {
    additions: [
      '\n\n## Implementation Guide\nSuccessful website features require understanding user needs, intuitive design, and reliable performance.',
      '\n\n## Best Practices\nModern web applications should prioritize accessibility, mobile responsiveness, and fast load times.',
    ],
    references: [
      'https://www.w3.org/web-standards',
      'https://developers.google.com/web'
    ]
  }
};

function enhanceArticle(article) {
  // Determine topic
  const title = article.title.toLowerCase();
  let enhancement = enhancements['AI']; // default
  
  for (const [key, value] of Object.entries(enhancements)) {
    if (title.includes(key.toLowerCase())) {
      enhancement = value;
      break;
    }
  }
  
  // Create enhanced content
  const enhancedContent = article.content + enhancement.additions.join('');
  
  return {
    title: `[Enhanced] ${article.title}`,
    content: enhancedContent,
    excerpt: article.excerpt,
    url: article.url,
    published_date: article.published_date,
    source: 'BeyondChats Enhanced',
    is_updated: 1,
    parent_article_id: article.id,
    reference_urls: enhancement.references.join(','),
    scraped_at: new Date().toISOString()
  };
}

async function runEnhancement() {
  console.log('\n📝 Creating enhanced versions...');
  
  return new Promise((resolve, reject) => {
    database.getAll((err, articles) => {
      if (err) {
        console.error('Error fetching articles:', err);
        return reject(err);
      }
      
      const originals = articles.filter(a => !a.is_updated);
      console.log(`Found ${originals.length} original articles to enhance`);
      
      let completed = 0;
      
      originals.forEach(article => {
        const enhanced = enhanceArticle(article);
        
        database.create(enhanced, (err, id) => {
          if (err) {
            console.error(`✗ Error enhancing article ${article.id}:`, err.message);
          } else {
            console.log(`✓ Enhanced: ${article.title} (New ID: ${id})`);
          }
          
          completed++;
          if (completed === originals.length) {
            console.log(`\n✅ Enhancement complete! Created ${originals.length} enhanced articles`);
            resolve();
          }
        });
      });
      
      if (originals.length === 0) {
        console.log('No articles to enhance');
        resolve();
      }
    });
  });
}

module.exports = { runEnhancement };
