import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Clock, 
  BookOpen, 
  Bookmark, 
  Share2, 
  Calendar,
  Building2 
} from 'lucide-react';

export default function ArticleModal({ 
  article, 
  onClose, 
  isSaved, 
  onToggleSave 
}) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(article.url);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        {/* Header Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div className="source-pill">
            {article.favicon && (
              <img
                src={article.favicon}
                alt=""
                className="source-favicon"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <span>{article.source}</span>
          </div>

          <span className="pill-badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-violet)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            {article.badge || 'Report'}
          </span>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {article.timeAgo}
          </span>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={13} /> {article.readTime} min read
          </span>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, lineHeight: 1.35, color: 'var(--text-primary)', marginBottom: '16px' }}>
          {article.title}
        </h2>

        {/* Snippet / Content */}
        <div className="modal-body">
          {article.snippet ? (
            article.snippet
          ) : (
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
              No text synopsis was included in this sheet record. Please open the complete story directly at the publisher link below.
            </p>
          )}
        </div>

        {/* Meta Details Panel */}
        <div style={{ 
          background: 'var(--bg-primary)', 
          border: '1px solid var(--surface-border)', 
          borderRadius: 'var(--radius-md)', 
          padding: '14px 18px', 
          marginBottom: '24px', 
          fontSize: '0.825rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Published ISO Time:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {article.publishedDate || 'N/A'}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Ingestion Date:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              {article.dateUpdated || 'Latest batch'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={16} /> Open Full Story
            </a>

            <button
              className="btn-secondary"
              onClick={handleCopyLink}
            >
              <Share2 size={16} /> Copy URL
            </button>
          </div>

          <button
            className={`btn-icon ${isSaved ? 'active' : ''}`}
            onClick={() => onToggleSave(article.id)}
            title={isSaved ? 'Remove Bookmark' : 'Save Story'}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
