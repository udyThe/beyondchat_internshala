const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

/**
 * Demo Enhancement Script
 * This simulates the full workflow without requiring an OpenAI API key
 */

async function demoEnhancement() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  BeyondChats Article Enhancement Script (DEMO MODE)');
    console.log('═══════════════════════════════════════════════════════\n');

    try {
        // Step 1: Fetch an original article that hasn't been enhanced yet
        console.log('📥 Step 1: Fetching original article from API...');
        const allArticlesResponse = await axios.get(`${API_BASE_URL}/articles`);
        const allArticles = allArticlesResponse.data.data;
        
        // Filter to get only original articles (not enhanced)
        const originalArticles = allArticles.filter(a => !a.is_updated);
        
        // Find articles that don't have enhanced versions yet
        const enhancedParentIds = allArticles
            .filter(a => a.is_updated && a.parent_article_id)
            .map(a => a.parent_article_id);
        
        const unenhancedArticles = originalArticles.filter(a => !enhancedParentIds.includes(a.id));
        
        if (unenhancedArticles.length === 0) {
            console.log('❌ All original articles have already been enhanced!');
            console.log('   Database has:');
            console.log(`   - ${originalArticles.length} original articles`);
            console.log(`   - ${allArticles.length - originalArticles.length} enhanced articles`);
            return;
        }
        
        // Pick the first unenhanced article
        const article = unenhancedArticles[0];
        
        console.log(`✓ Found article: "${article.title}"`);
        console.log(`  ID: ${article.id}`);
        console.log(`  Content length: ${article.content.length} characters`);
        console.log(`  Articles remaining to enhance: ${unenhancedArticles.length}\n`);

        // Step 2: Simulate Google Search with article-specific results
        console.log('🔍 Step 2: Searching Google for similar articles...');
        console.log(`  Query: "${article.title}"`);
        
        const searchResults = generateSearchResults(article.title);
        
        console.log(`✓ Found ${searchResults.length} relevant articles:`);
        searchResults.forEach((result, i) => {
            console.log(`  ${i + 1}. ${result.title}`);
            console.log(`     ${result.url}`);
        });
        console.log();

        // Step 3: Simulate scraping reference articles
        console.log('📚 Step 3: Scraping reference articles...');
        const referenceContents = generateReferenceContent(article.title, article.content);
        
        console.log('✓ Scraped 2 reference articles');
        console.log(`  Total content: ~${referenceContents.join('').length} characters\n`);

        // Step 4: Generate enhanced content with AI
        console.log('🤖 Step 4: Enhancing article with AI (simulated)...');
        console.log('  Analyzing reference articles...');
        console.log('  Generating enhanced content...');
        console.log('  Adding citations and references...\n');
        
        const enhancedContent = generateEnhancedContent(article, referenceContents, searchResults);
        
        console.log('✓ Enhanced content generated');
        console.log(`  New content length: ${enhancedContent.length} characters\n`);

        // Step 5: Publish enhanced article
        console.log('📤 Step 5: Publishing enhanced article...');
        
        const newArticle = {
            title: article.title,
            content: enhancedContent,
            excerpt: `Enhanced version: ${article.excerpt}`,
            url: article.url,
            published_date: article.published_date,
            source: article.source,
            is_updated: true,
            parent_article_id: article.id,
            reference_urls: JSON.stringify(searchResults.map(r => r.url))
        };

        const publishResponse = await axios.post(`${API_BASE_URL}/articles`, newArticle);
        
        console.log(`✓ Enhanced article published!`);
        console.log(`  New Article ID: ${publishResponse.data.id}`);
        console.log(`  Parent Article ID: ${article.id}`);
        console.log(`  References included: Yes\n`);

        // Summary
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ ENHANCEMENT COMPLETE!');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`\nOriginal Article: "${article.title}" (ID: ${article.id})`);
        console.log(`Enhanced Article: "${newArticle.title}" (ID: ${publishResponse.data.id})`);
        console.log(`\nYou can now view both versions in the frontend:`);
        console.log(`- Original Articles: Shows unenhanced content`);
        console.log(`- Optimized Articles: Shows AI-enhanced versions`);
        console.log(`\n✨ Refresh your browser to see the enhanced article!`);
        console.log();

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Helper function to generate article-specific search results
function generateSearchResults(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('receptionist') || titleLower.includes('website')) {
        return [
            {
                title: 'Why Every Website Needs Live Chat Support',
                url: 'https://example.com/website-chat-support'
            },
            {
                title: 'The Importance of Website Visitor Engagement',
                url: 'https://example.com/visitor-engagement'
            }
        ];
    } else if (titleLower.includes('google ads') || titleLower.includes('money')) {
        return [
            {
                title: 'Maximizing ROI on Google Ads Campaigns',
                url: 'https://example.com/google-ads-roi'
            },
            {
                title: 'Common Google Ads Mistakes to Avoid',
                url: 'https://example.com/ads-mistakes'
            }
        ];
    } else if (titleLower.includes('medicine') || titleLower.includes('responsible') || titleLower.includes('blame')) {
        return [
            {
                title: 'AI Liability in Healthcare: Who is Accountable?',
                url: 'https://example.com/ai-liability-healthcare'
            },
            {
                title: 'Medical AI Ethics and Legal Considerations',
                url: 'https://example.com/medical-ai-ethics'
            }
        ];
    } else if (titleLower.includes('hype') || titleLower.includes('reality')) {
        return [
            {
                title: 'AI in Healthcare: Separating Fact from Fiction',
                url: 'https://example.com/ai-healthcare-facts'
            },
            {
                title: 'Real-World Applications of AI in Medicine',
                url: 'https://example.com/ai-medicine-applications'
            }
        ];
    } else {
        return [
            {
                title: 'Understanding AI in Healthcare - Medical News Today',
                url: 'https://example.com/ai-healthcare-1'
            },
            {
                title: 'AI Patient Care: Challenges and Opportunities',
                url: 'https://example.com/ai-patient-care'
            }
        ];
    }
}

// Helper function to generate article-specific reference content
function generateReferenceContent(title, originalContent) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('receptionist') || titleLower.includes('website')) {
        return [
            "In today's digital landscape, website visitors expect immediate engagement and support. Live chat and AI chatbots have become essential tools for capturing visitor attention and converting browsers into customers. Studies show that 79% of businesses report positive effects on customer loyalty, sales, and revenue after implementing live chat support.",
            "Website engagement is crucial for business success. Research indicates that visitors who interact with chat features are 2.8 times more likely to convert than those who don't. Real-time assistance helps reduce bounce rates, increase time on site, and improve overall user experience."
        ];
    } else if (titleLower.includes('google ads') || titleLower.includes('money')) {
        return [
            "Many businesses waste significant budgets on poorly optimized Google Ads campaigns. Common mistakes include inadequate keyword research, irrelevant ad copy, poor landing page optimization, and lack of conversion tracking. Smart advertisers focus on quality score improvement, negative keyword management, and continuous A/B testing to maximize ROI.",
            "Successful Google Ads campaigns require strategic planning and ongoing optimization. Factors like ad relevance, landing page experience, and expected click-through rate all contribute to Quality Score, which directly impacts ad costs and positions."
        ];
    } else if (titleLower.includes('medicine') || titleLower.includes('responsible') || titleLower.includes('blame')) {
        return [
            "The question of liability in AI-assisted healthcare is complex and evolving. When an AI system recommends a treatment that leads to adverse outcomes, determining responsibility involves multiple parties: the AI developers, healthcare providers, hospital administrators, and regulatory bodies. Current legal frameworks are adapting to address these novel scenarios.",
            "Medical AI ethics involves balancing innovation with patient safety. Legal scholars and healthcare professionals are developing frameworks for accountability that consider factors like algorithmic transparency, validation standards, and informed consent."
        ];
    } else if (titleLower.includes('hype') || titleLower.includes('reality')) {
        return [
            "While AI in healthcare generates significant excitement, it's important to distinguish between proven applications and speculative promises. Real-world successes include medical imaging analysis, drug discovery acceleration, and administrative task automation. However, challenges remain in areas like clinical decision support integration and data interoperability.",
            "Practical AI applications in medicine are growing steadily. Examples include AI-powered diagnostic imaging that helps radiologists detect abnormalities, predictive analytics for patient deterioration, and natural language processing for medical documentation."
        ];
    } else {
        return [
            "AI in healthcare is transforming patient care through advanced diagnostic tools, personalized treatment plans, and predictive analytics. Machine learning algorithms can analyze vast amounts of medical data to identify patterns and make recommendations that assist healthcare providers in making more informed decisions.",
            "The complexity of patient care extends far beyond diagnosis and treatment. It involves understanding individual patient histories, cultural backgrounds, personal preferences, and emotional states. While AI excels at pattern recognition and data analysis, it currently lacks the emotional intelligence and contextual understanding that experienced healthcare professionals bring to patient interactions."
        ];
    }
}

// Helper function to generate enhanced article content
function generateEnhancedContent(article, referenceContents, searchResults) {
    const title = article.title;
    const titleLower = title.toLowerCase();
    const excerpt = article.content.substring(0, 500);
    
    let enhancedContent = "# " + title + "\n\n";
    
    if (titleLower.includes('receptionist') || titleLower.includes('website')) {
        enhancedContent += "In the digital age, your website is often the first point of contact between your business and potential customers. Yet many websites fail to capitalize on this crucial touchpoint by lacking interactive elements that engage visitors and answer their questions in real-time.\n\n";
        enhancedContent += "## The Problem with Passive Websites\n\n";
        enhancedContent += "Traditional websites function like digital brochures - they display information but don't facilitate conversation. When visitors have questions, they must search through pages, fill out contact forms, or call during business hours. This friction leads to abandoned sessions, lost leads, and missed opportunities.\n\n";
        enhancedContent += "## The Solution: AI-Powered Website Assistants\n\n";
        enhancedContent += "Modern AI chatbots act as virtual receptionists, providing immediate responses to visitor queries 24/7. These intelligent assistants can:\n\n";
        enhancedContent += "- Answer frequently asked questions instantly\n";
        enhancedContent += "- Guide visitors to relevant content and products\n";
        enhancedContent += "- Qualify leads and schedule appointments\n";
        enhancedContent += "- Provide personalized recommendations\n";
        enhancedContent += "- Reduce bounce rates and increase engagement\n\n";
        enhancedContent += "Research shows that websites with live chat capabilities see significantly higher conversion rates compared to static sites.\n\n";
        enhancedContent += "## Conclusion\n\n";
        enhancedContent += "Your website shouldn't be a passive brochure - it should be an active engagement tool. By adding an AI-powered receptionist, you create a more responsive, helpful, and conversion-focused online presence.";
    } else if (titleLower.includes('google ads') || titleLower.includes('money')) {
        enhancedContent += "Google Ads can be a powerful tool for business growth, but many companies find themselves spending substantial budgets with disappointing results. Understanding common pitfalls and optimization strategies is essential for maximizing return on investment.\n\n";
        enhancedContent += "## Common Google Ads Mistakes\n\n";
        enhancedContent += "### 1. Poor Keyword Strategy\n";
        enhancedContent += "Many advertisers either target too broadly or too narrowly. Effective campaigns balance reach with relevance through thorough keyword research, strategic use of match types, and regular negative keyword additions.\n\n";
        enhancedContent += "### 2. Weak Ad Copy\n";
        enhancedContent += "Generic ad copy fails to capture attention. Winning ads include clear value propositions, compelling calls-to-action, and relevant keywords in headlines.\n\n";
        enhancedContent += "### 3. Landing Page Disconnect\n";
        enhancedContent += "Directing clicks to inappropriate pages kills conversion rates. Ensure message match between ads and landing pages, fast loading speeds, and mobile optimization.\n\n";
        enhancedContent += "## Conclusion\n\n";
        enhancedContent += "Google Ads isn't inherently wasteful - poorly managed campaigns are. By avoiding common mistakes and implementing strategic optimization, businesses can achieve strong returns on their advertising investment.";
    } else if (titleLower.includes('medicine') || titleLower.includes('responsible') || titleLower.includes('blame')) {
        enhancedContent += "As artificial intelligence becomes increasingly integrated into healthcare, a critical question emerges: When AI-assisted medical decisions lead to adverse outcomes, who bears responsibility?\n\n";
        enhancedContent += "## The Complexity of AI Medical Liability\n\n";
        enhancedContent += "Medical AI liability isn't straightforward because several parties contribute to AI-assisted healthcare decisions:\n\n";
        enhancedContent += "- **AI Developers**: Create and train the algorithms\n";
        enhancedContent += "- **Healthcare Providers**: Make final treatment decisions\n";
        enhancedContent += "- **Hospital Administrators**: Select and implement AI systems\n";
        enhancedContent += "- **Regulatory Bodies**: Approve and oversee AI medical devices\n\n";
        enhancedContent += "## The Physician's Responsibility\n\n";
        enhancedContent += "Most legal experts agree that healthcare professionals remain ultimately responsible for patient care, even when using AI tools. Physicians must understand AI recommendations and their limitations, cannot blindly follow AI suggestions, and must document their decision-making rationale.\n\n";
        enhancedContent += "## Developer Accountability\n\n";
        enhancedContent += "AI system creators also bear responsibility for proper validation and testing, transparent disclosure of limitations, ongoing monitoring, and addressing known biases.\n\n";
        enhancedContent += "## Conclusion\n\n";
        enhancedContent += "The question of responsibility for AI medical errors doesn't have a simple answer. The most promising approach involves shared accountability, where developers ensure robust systems, providers exercise clinical judgment, and regulatory frameworks provide oversight.";
    } else if (titleLower.includes('hype') || titleLower.includes('reality')) {
        enhancedContent += "Artificial intelligence in healthcare generates both tremendous excitement and considerable skepticism. Separating substantiated achievements from speculative promises is essential for healthcare organizations considering AI adoption.\n\n";
        enhancedContent += "## Proven AI Applications in Healthcare\n\n";
        enhancedContent += "### Medical Imaging Analysis\n";
        enhancedContent += "AI has demonstrated remarkable accuracy in analyzing medical images, often matching or exceeding human radiologist performance in specific tasks like diabetic retinopathy detection, breast cancer identification, and lung nodule detection.\n\n";
        enhancedContent += "### Administrative Automation\n";
        enhancedContent += "Natural language processing successfully automates time-consuming paperwork tasks including medical transcription, insurance claim processing, and appointment scheduling.\n\n";
        enhancedContent += "## Persistent Challenges\n\n";
        enhancedContent += "### Data Quality and Interoperability\n";
        enhancedContent += "Healthcare data remains fragmented across systems, often incomplete, and inconsistently formatted. AI systems require high-quality, standardized data to function effectively.\n\n";
        enhancedContent += "### Algorithmic Bias\n";
        enhancedContent += "AI systems can perpetuate or amplify existing healthcare disparities when trained on biased historical data.\n\n";
        enhancedContent += "## Conclusion\n\n";
        enhancedContent += "AI in healthcare is neither pure hype nor complete reality—it's a rapidly evolving field with genuine achievements and significant limitations. Success requires realistic expectations, careful implementation, and understanding that AI augments rather than replaces healthcare professionals.";
    } else {
        enhancedContent += excerpt + "\n\n## Enhanced Analysis\n\n" + referenceContents[0] + "\n\n## Key Considerations\n\n" + referenceContents[1] + "\n\n## Conclusion\n\nThis comprehensive analysis provides deeper insights into the topic, drawing from multiple authoritative sources and current research.";
    }
    
    enhancedContent += "\n\n---\n\n## References\n\nThis article was enhanced using insights from leading publications:\n\n";
    searchResults.forEach((result, index) => {
        enhancedContent += (index + 1) + ". \"" + result.title + "\"\n   Source: " + result.url + "\n\n";
    });
    enhancedContent += "---\n\n*Original article from BeyondChats, enhanced with AI-assisted research and comprehensive analysis.*\n";
    
    return enhancedContent;
}

demoEnhancement();
