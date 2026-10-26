import React from 'react';
import { 
  Clock, 
  BookOpen, 
  Bookmark, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

export default function NewsCard({ 
  article, 
  onSelectArticle, 
  isSaved, 
  onToggleSave 
}) {
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.url);
      alert('Article URL copied to clipboard!');
    }
  };

  const getBadgeClass = (badge) => {
    if (badge === 'Breaking') return 'breaking';
    if (badge === 'Hot Deal') return 'deal';
    return 'default';
  };

  return (
    <article className="news-card">
      <div>
        {/* Top: Source & Badges */}
        <div className="card-top">
          <div className="card-source-wrap">
            {article.favicon && (
              <img 
                src={article.favicon} 
                alt="" 
                className="source-favicon"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span className="card-source-name" title={article.source}>
              {article.source}
            </span>
          </div>

          <div className="card-badges">
            <span className={`badge-tag ${getBadgeClass(article.badge)}`}>
              {article.badge}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="card-title" 
          onClick={() => onSelectArticle(article)}
          title={article.title}
        >
          {article.title}
        </h3>

        {/* Snippet */}
        <p className="card-snippet">
          {article.snippet || 'No expanded preview available. Click to inspect full article details.'}
        </p>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="card-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {article.timeAgo}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={13} /> {article.readTime}m
          </span>
        </div>

        <div className="card-actions">
          {/* Quick Reader Modal */}
          <button
            className="action-btn-sm"
            onClick={() => onSelectArticle(article)}
            title="Read summary preview"
          >
            <BookOpen size={14} />
          </button>

          {/* Bookmark Button */}
          <button
            className={`action-btn-sm ${isSaved ? 'saved' : ''}`}
            onClick={() => onToggleSave(article.id)}
            title={isSaved ? 'Remove from bookmarks' : 'Save bookmark'}
          >
            <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          {/* Share Button */}
          <button
            className="action-btn-sm"
            onClick={handleShare}
            title="Copy URL"
          >
            <Share2 size={14} />
          </button>

          {/* External Source Link */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn-sm"
            title={`Visit ${article.source}`}
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
