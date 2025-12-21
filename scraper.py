"""
BeyondChats Blog Scraper
Scrapes the 5 oldest articles from the last page of BeyondChats blogs
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
from scraper_config import BLOG_BASE_URL, API_BASE_URL, NUM_ARTICLES, USER_AGENT

def scrape_beyondchats_blogs():
    """Scrape articles from BeyondChats blog"""
    
    base_url = BLOG_BASE_URL
    
    print(f"Fetching blog page from {base_url}...")
    
    try:
        # First, get the main blogs page to find pagination
        response = requests.get(base_url, headers={
            'User-Agent': USER_AGENT
        })
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Try to find pagination or article links
        # This will depend on the actual structure of the website
        articles = []
        
        # Look for article cards/links
        # Common patterns: article tags, divs with specific classes, etc.
        article_elements = soup.find_all(['article', 'div'], class_=lambda x: x and ('post' in str(x).lower() or 'article' in str(x).lower() or 'blog' in str(x).lower()))
        
        if not article_elements:
            # Try finding links that might be articles
            article_links = soup.find_all('a', href=lambda x: x and '/blog' in str(x).lower())
            article_elements = article_links
        
        print(f"Found {len(article_elements)} potential article elements")
        
        # Extract article information
        for idx, element in enumerate(article_elements[:10]):  # Get first 10 to analyze
            try:
                article_data = {}
                
                # Try to find title
                title_elem = element.find(['h1', 'h2', 'h3', 'h4'])
                if title_elem:
                    article_data['title'] = title_elem.get_text(strip=True)
                elif element.name == 'a':
                    article_data['title'] = element.get_text(strip=True)
                else:
                    article_data['title'] = f"Article {idx + 1}"
                
                # Try to find link
                link_elem = element.find('a') if element.name != 'a' else element
                if link_elem and link_elem.get('href'):
                    url = link_elem['href']
                    if not url.startswith('http'):
                        url = 'https://beyondchats.com' + url
                    article_data['url'] = url
                else:
                    article_data['url'] = base_url
                
                # Try to find excerpt/description
                excerpt_elem = element.find('p')
                if excerpt_elem:
                    article_data['excerpt'] = excerpt_elem.get_text(strip=True)[:500]
                else:
                    article_data['excerpt'] = ""
                
                # Try to find date
                date_elem = element.find(['time', 'span'], class_=lambda x: x and 'date' in str(x).lower())
                if date_elem:
                    article_data['published_date'] = date_elem.get_text(strip=True)
                else:
                    article_data['published_date'] = datetime.now().strftime('%Y-%m-%d')
                
                # Scrape full content if we have a URL
                if article_data.get('url') and article_data['url'] != base_url:
                    print(f"Scraping article: {article_data['title']}")
                    content = scrape_article_content(article_data['url'])
                    article_data['content'] = content
                else:
                    article_data['content'] = article_data.get('excerpt', '')
                
                article_data['source'] = 'BeyondChats'
                article_data['scraped_at'] = datetime.now().isoformat()
                
                if article_data.get('title'):
                    articles.append(article_data)
                
                time.sleep(1)  # Be respectful with scraping
                
            except Exception as e:
                print(f"Error processing element {idx}: {e}")
                continue
        
        # Get the last 5 (oldest) articles
        oldest_articles = articles[-5:] if len(articles) >= 5 else articles
        
        # Save to JSON file
        output_file = 'scraped_articles.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(oldest_articles, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Successfully scraped {len(oldest_articles)} articles")
        print(f"✓ Saved to {output_file}")
        
        return oldest_articles
        
    except Exception as e:
        print(f"Error scraping BeyondChats: {e}")
        return []

def scrape_article_content(url):
    """Scrape the full content of an individual article - ENHANCED VERSION"""
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # First, try to find and extract the actual blog post content
        # BeyondChats specific: Look for the main blog content
        
        # Remove unwanted elements first
        for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe', 'form', 'button']):
            element.decompose()
        
        # Remove comments section
        for comment_section in soup.find_all(['div', 'section'], class_=lambda x: x and any(
            word in str(x).lower() for word in ['comment', 'reply', 'discussion']
        )):
            comment_section.decompose()
        
        # Try to find the main article content
        content_text = ""
        
        # Strategy 1: Look for article tag
        article_tag = soup.find('article')
        if article_tag:
            # Get all paragraphs within article, excluding comments
            paragraphs = []
            for p in article_tag.find_all('p'):
                text = p.get_text(strip=True)
                # Filter out comment-like content
                if text and len(text) > 50 and not any(
                    phrase in text.lower() for phrase in ['reply', 'comment', 'leave a comment', 'says:', 'wrote:']
                ):
                    paragraphs.append(text)
            
            if paragraphs:
                content_text = '\n\n'.join(paragraphs)
        
        # Strategy 2: Look for main content divs
        if len(content_text) < 300:
            for class_name in ['post-content', 'entry-content', 'article-body', 'blog-post', 'content-area', 'post-body']:
                content_div = soup.find(['div', 'section'], class_=lambda x: x and class_name in str(x).lower())
                if content_div:
                    paragraphs = []
                    for p in content_div.find_all(['p', 'h2', 'h3', 'h4']):
                        text = p.get_text(strip=True)
                        if text and len(text) > 30:
                            paragraphs.append(text)
                    if len(paragraphs) > 3:
                        content_text = '\n\n'.join(paragraphs)
                        break
        
        # Strategy 3: Get all paragraphs from body, but filter intelligently
        if len(content_text) < 300:
            all_paragraphs = soup.find_all('p')
            main_content = []
            for p in all_paragraphs:
                text = p.get_text(strip=True)
                # Only include substantial paragraphs, exclude navigation/footer/comment text
                if (len(text) > 100 and 
                    not any(word in text.lower() for word in ['cookie', 'privacy policy', 'terms of service', 'copyright', '©', 'all rights reserved']) and
                    not text.lower().startswith(('reply', 'comment', 'posted by', 'written by')) and
                    not '@' in text):  # Likely email or social media
                    main_content.append(text)
            
            if len(main_content) >= 3:
                content_text = '\n\n'.join(main_content)
        
        # Final cleanup
        if content_text and len(content_text) > 200:
            return content_text[:15000]  # Return up to 15k characters
        
        return f"Unable to extract sufficient content from {url}. The page may require JavaScript or have a different structure."
        
    except Exception as e:
        print(f"  ⚠ Error scraping article content from {url}: {e}")
        return f"Error extracting content: {str(e)}"

if __name__ == "__main__":
    print("=" * 60)
    print("BeyondChats Blog Scraper")
    print(f"Target: {BLOG_BASE_URL}")
    print(f"Number of articles: {NUM_ARTICLES}")
    print("=" * 60)
    print()
    
    articles = scrape_beyondchats_blogs()
    
    print("\n" + "=" * 60)
    print("Scraped Articles:")
    print("=" * 60)
    for i, article in enumerate(articles, 1):
        print(f"\n{i}. {article.get('title', 'No title')}")
        print(f"   URL: {article.get('url', 'No URL')}")
        print(f"   Content length: {len(article.get('content', ''))} chars")
