import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleAPI } from '../api';
import ReactMarkdown from 'react-markdown';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticle, setRelatedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articleAPI.getById(id);
      setArticle(response.data);

      // If this is an optimized article, fetch the original
      if (response.data.parent_article_id) {
        const parentResponse = await articleAPI.getById(response.data.parent_article_id);
        setRelatedArticle(parentResponse.data);
      }
      // If this is an original article, try to find the optimized version
      else {
        const allArticles = await articleAPI.getAll();
        const optimizedVersion = allArticles.data.find(
          a => a.parent_article_id === parseInt(id)
        );
        if (optimizedVersion) {
          setRelatedArticle(optimizedVersion);
        }
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load article. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const parseReferences = (referenceUrls) => {
    try {
      return JSON.parse(referenceUrls);
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading article...</p>
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

  if (!article) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">❌</div>
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Articles
        </Link>
      </div>
    );
  }

  const references = article.reference_urls ? parseReferences(article.reference_urls) : null;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to Articles
      </Link>

      <div className="article-detail">
        <div className="article-detail-header">
          <div style={{ marginBottom: '1rem' }}>
            <span className={`article-badge ${article.is_updated ? 'badge-optimized' : 'badge-original'}`}>
              {article.is_updated ? '✨ Optimized Version' : '📄 Original Article'}
            </span>
          </div>

          <h1>{article.title}</h1>

          <div className="article-meta" style={{ fontSize: '1rem' }}>
            <span>📅 {formatDate(article.published_date)}</span>
            <span>🏷️ {article.source}</span>
            {article.scraped_at && (
              <span>🕒 Scraped: {formatDate(article.scraped_at)}</span>
            )}
          </div>

          {article.url && (
            <div style={{ marginTop: '1rem' }}>
              <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem' }}>
                🔗 View Original Source →
              </a>
            </div>
          )}
        </div>

        <div className="article-content">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {references && references.length > 0 && (
          <div className="article-references">
            <h3>📚 References</h3>
            {references.map((ref, index) => (
              <div key={index} className="reference-item">
                {index + 1}.{' '}
                <a href={ref.url} target="_blank" rel="noopener noreferrer">
                  {ref.title}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedArticle && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            {article.is_updated ? '📄 Original Version' : '✨ Optimized Version'}
          </h2>
          <div className="article-card" style={{ maxWidth: '600px' }}>
            <div className="article-card-header">
              <span className={`article-badge ${relatedArticle.is_updated ? 'badge-optimized' : 'badge-original'}`}>
                {relatedArticle.is_updated ? '✨ Optimized' : '📄 Original'}
              </span>
            </div>

            <h3>{relatedArticle.title}</h3>

            <div className="article-meta">
              <span>📅 {formatDate(relatedArticle.published_date)}</span>
              <span>🏷️ {relatedArticle.source}</span>
            </div>

            <div className="article-card-footer">
              <span></span>
              <button 
                onClick={() => navigate(`/article/${relatedArticle.id}`)} 
                className="btn btn-primary"
              >
                View {relatedArticle.is_updated ? 'Optimized' : 'Original'} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;
