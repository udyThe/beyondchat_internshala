"""
BeyondChats Blog Scraper
Scrapes the 5 oldest articles from the last page of BeyondChats blogs
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

def scrape_beyondchats_blogs():
    """Scrape articles from BeyondChats blog"""
    
    base_url = "https://beyondchats.com/blogs"
    
    print("Fetching blog page...")
    
    try:
        # First, get the main blogs page to find pagination
        response = requests.get(base_url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
    """Scrape the full content of an individual article"""
    try:
        response = requests.get(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'iframe']):
            element.decompose()
        
        # Try multiple strategies to find content
        content_elem = None
        
        # Strategy 1: Look for article or main tags
        content_elem = soup.find('article')
        if not content_elem:
            content_elem = soup.find('main')
        
        # Strategy 2: Look for common content class names
        if not content_elem:
            content_elem = soup.find('div', class_=lambda x: x and any(
                word in str(x).lower() for word in ['post-content', 'entry-content', 'article-content', 'blog-content', 'content-area']
            ))
        
        # Strategy 3: Look for any div with 'content' in class
        if not content_elem:
            content_elem = soup.find('div', class_=lambda x: x and 'content' in str(x).lower())
        
        # Strategy 4: Fall back to body but try to exclude common non-content areas
        if not content_elem:
            content_elem = soup.find('body')
            if content_elem:
                # Remove header, footer, sidebar, etc.
                for elem in content_elem.find_all(['header', 'footer', 'nav', 'aside']):
                    elem.decompose()
        
        if content_elem:
            # Extract text from paragraphs and headings
            text_elements = []
            for elem in content_elem.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']):
                text = elem.get_text(strip=True)
                if text and len(text) > 20:  # Filter out very short text
                    text_elements.append(text)
            
            content = '\n\n'.join(text_elements)
            
            # If content is too short, try getting all text
            if len(content) < 200:
                content = content_elem.get_text(separator='\n\n', strip=True)
            
            return content[:10000]  # Increased limit
        
        return "Content could not be extracted from this article."
        
    except Exception as e:
        print(f"  ⚠ Error scraping article content from {url}: {e}")
        return f"Error extracting content: {str(e)}"

if __name__ == "__main__":
    print("=" * 60)
    print("BeyondChats Blog Scraper")
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
