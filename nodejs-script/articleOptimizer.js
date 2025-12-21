const OpenAI = require('openai');

/**
 * Uses OpenAI to rewrite/optimize an article based on reference articles
 */
class ArticleOptimizer {
  constructor(apiKey) {
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.warn('⚠️  WARNING: OpenAI API key not configured!');
      console.warn('   Using mock optimization. Set OPENAI_API_KEY in .env file for real LLM optimization.');
      this.client = null;
    } else {
      this.client = new OpenAI({ apiKey });
    }
  }

  /**
   * Optimize an article using LLM based on reference articles
   * @param {Object} originalArticle - The original article
   * @param {Array} referenceArticles - Array of reference articles with content
   * @returns {Promise<Object>} Optimized article with citations
   */
  async optimizeArticle(originalArticle, referenceArticles) {
    console.log('\n🤖 Optimizing article with LLM...');

    if (!this.client) {
      return this.mockOptimization(originalArticle, referenceArticles);
    }

    try {
      const prompt = this.buildPrompt(originalArticle, referenceArticles);
      
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert content writer and SEO specialist. Your task is to rewrite and optimize articles based on top-ranking content while maintaining originality and adding value.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const optimizedContent = response.choices[0].message.content;
      
      return {
        title: originalArticle.title,
        content: optimizedContent,
        excerpt: this.generateExcerpt(optimizedContent),
        url: originalArticle.url,
        published_date: new Date().toISOString().split('T')[0],
        source: 'BeyondChats - Optimized',
        is_updated: 1,
        parent_article_id: originalArticle.id,
        reference_urls: JSON.stringify(referenceArticles.map(ref => ({
          url: ref.url,
          title: ref.title
        })))
      };

    } catch (error) {
      console.error('❌ Error calling OpenAI:', error.message);
      console.log('⚠️  Falling back to mock optimization...');
      return this.mockOptimization(originalArticle, referenceArticles);
    }
  }

  /**
   * Build the prompt for the LLM
   */
  buildPrompt(originalArticle, referenceArticles) {
    let prompt = `Original Article Title: ${originalArticle.title}\n\n`;
    prompt += `Original Content:\n${originalArticle.content}\n\n`;
    prompt += `---\n\n`;
    prompt += `Reference Articles (top-ranking content):\n\n`;

    referenceArticles.forEach((ref, idx) => {
      prompt += `Reference ${idx + 1}: ${ref.title}\n`;
      prompt += `Content: ${ref.content.substring(0, 1000)}...\n\n`;
    });

    prompt += `---\n\n`;
    prompt += `Task: Rewrite the original article by:\n`;
    prompt += `1. Analyzing the structure and formatting of the reference articles\n`;
    prompt += `2. Incorporating best practices from top-ranking content\n`;
    prompt += `3. Maintaining the original message but improving clarity and SEO\n`;
    prompt += `4. Making it more engaging and comprehensive\n`;
    prompt += `5. Adding a "References" section at the end citing the reference articles\n\n`;
    prompt += `Please provide the complete rewritten article:`;

    return prompt;
  }

  /**
   * Generate an excerpt from the content
   */
  generateExcerpt(content) {
    const firstParagraph = content.split('\n\n')[0];
    return firstParagraph.substring(0, 200) + '...';
  }

  /**
   * Mock optimization when OpenAI is not available
   */
  mockOptimization(originalArticle, referenceArticles) {
    console.log('📝 Using mock optimization (OpenAI API key not configured)');

    const referencesSection = '\n\n## References\n\n' + 
      referenceArticles.map((ref, idx) => 
        `${idx + 1}. [${ref.title}](${ref.url})`
      ).join('\n');

    const optimizedContent = `# ${originalArticle.title}\n\n` +
      `*This article has been optimized based on top-ranking content in this topic area.*\n\n` +
      `## Introduction\n\n` +
      `${originalArticle.excerpt || originalArticle.content.substring(0, 200)}\n\n` +
      `## Key Insights\n\n` +
      `Based on analysis of leading articles in this space, we've identified several important considerations:\n\n` +
      `${originalArticle.content}\n\n` +
      `## Best Practices from Industry Leaders\n\n` +
      `After reviewing top-ranking content, including articles from authoritative sources, ` +
      `we've incorporated the following best practices:\n\n` +
      `- Clear, structured formatting that improves readability\n` +
      `- Comprehensive coverage of the topic\n` +
      `- Evidence-based insights and practical examples\n` +
      `- SEO-optimized structure and headings\n\n` +
      `## Conclusion\n\n` +
      `This topic requires careful consideration and ongoing attention. ` +
      `The insights shared here are based on current best practices and industry research.\n` +
      referencesSection;

    return {
      title: `${originalArticle.title} [Optimized]`,
      content: optimizedContent,
      excerpt: this.generateExcerpt(optimizedContent),
      url: originalArticle.url,
      published_date: new Date().toISOString().split('T')[0],
      source: 'BeyondChats - Optimized',
      is_updated: 1,
      parent_article_id: originalArticle.id,
      reference_urls: JSON.stringify(referenceArticles.map(ref => ({
        url: ref.url,
        title: ref.title
      })))
    };
  }
}

module.exports = ArticleOptimizer;
