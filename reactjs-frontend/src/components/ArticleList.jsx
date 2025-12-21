import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../api';

function ArticleList({ filter = 'all' }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [filter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleAPI.getAll();
      
      let filteredArticles = response.data || [];
      
      // Apply filter
      if (filter === 'original') {
        filteredArticles = filteredArticles.filter(article => !article.is_updated || article.is_updated === 0);
      } else if (filter === 'optimized') {
        filteredArticles = filteredArticles.filter(article => article.is_updated === 1);
      }
      
      setArticles(filteredArticles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Make sure the API server is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const truncate = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h2>No Articles Found</h2>
        <p>There are no {filter !== 'all' ? filter : ''} articles to display.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>
          {filter === 'all' && 'All Articles'}
          {filter === 'original' && 'Original Articles'}
          {filter === 'optimized' && 'Optimized Articles'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Found {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="articles-grid">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="article-card-header">
              <span className={`article-badge ${article.is_updated ? 'badge-optimized' : 'badge-original'}`}>
                {article.is_updated ? '✨ Optimized' : '📄 Original'}
              </span>
            </div>

            <h3>{article.title}</h3>

            <div className="article-meta">
              <span>📅 {formatDate(article.published_date)}</span>
              <span>🏷️ {article.source}</span>
            </div>

            <p className="article-excerpt">
              {truncate(article.excerpt || article.content, 150)}
            </p>

            <div className="article-card-footer">
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                ID: {article.id}
              </span>
              <Link to={`/article/${article.id}`} className="btn btn-primary">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;
