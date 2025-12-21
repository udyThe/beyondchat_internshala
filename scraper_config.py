"""
Configuration for BeyondChats Blog Scraper
"""
import os

# Target blog URL
BLOG_BASE_URL = os.getenv('BLOG_URL', 'https://beyondchats.com/blogs')

# API endpoint to save articles
API_BASE_URL = os.getenv('API_BASE_URL', 'http://localhost:8000')

# Number of articles to scrape
NUM_ARTICLES = int(os.getenv('NUM_ARTICLES', '5'))

# User agent for web requests
USER_AGENT = os.getenv('USER_AGENT', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
