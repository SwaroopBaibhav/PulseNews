import React from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Clock, 
  BookOpen, 
  Bookmark, 
  Share2 
} from 'lucide-react';

export default function HeroSpotlight({ 
  article, 
  onSelectArticle, 
  isSaved, 
  onToggleSave 
}) {
  if (!article) return null;

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.url);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="container">
      <div className="hero-spotlight">
        {/* Header Row */}
        <div className="hero-header-row">
          <div className="hero-badge-group">
            <span className="pill-badge spotlight">
              <Sparkles size={13} /> Featured Spotlight
            </span>
            <span className="pill-badge" style={{ background: 'rgba(0, 210, 255, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
              {article.badge || 'Trending'}
            </span>
            <div className="source-pill">
              {article.favicon && (
                <img 
                  src={article.favicon} 
                  alt={article.source} 
                  className="source-favicon"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span>{article.source}</span>
            </div>
          </div>

          <div className="hero-meta">
            <span className="meta-item">
              <Clock size={14} /> {article.timeAgo}
            </span>
            <span className="meta-item">
              <BookOpen size={14} /> {article.readTime} min read
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 
          className="hero-title"
          onClick={() => onSelectArticle(article)}
        >
          {article.title}
        </h2>

        {/* Excerpt Snippet */}
        <p className="hero-snippet">
          {article.snippet || 'Click to explore the latest comprehensive coverage and market development from this publisher.'}
        </p>

        {/* Footer Actions */}
        <div className="hero-footer">
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => onSelectArticle(article)}
            >
              <BookOpen size={16} /> Quick Reader View
            </button>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <ExternalLink size={16} /> Read on {article.source}
            </a>
          </div>

          <div className="hero-actions">
            <button 
              className={`btn-icon ${isSaved ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(article.id);
              }}
              title={isSaved ? 'Remove Bookmark' : 'Save Story'}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button 
              className="btn-icon"
              onClick={handleShare}
              title="Copy Article URL"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
