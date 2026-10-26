import React from 'react';
import { ExternalLink, BookOpen, Bookmark } from 'lucide-react';

export default function NewsTable({
  articles,
  onSelectArticle,
  savedIds,
  onToggleSave
}) {
  return (
    <div className="container">
      <div className="table-wrapper">
        <table className="news-table">
          <thead>
            <tr>
              <th className="col-publisher" style={{ width: '180px' }}>Publisher</th>
              <th>Headline</th>
              <th className="col-category" style={{ width: '140px' }}>Category</th>
              <th className="col-published" style={{ width: '110px' }}>Published</th>
              <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((item) => {
              const isSaved = savedIds.includes(item.id);
              return (
                <tr key={item.id}>
                  {/* Publisher */}
                  <td className="col-publisher">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.favicon && (
                        <img
                          src={item.favicon}
                          alt=""
                          className="source-favicon"
                          loading="lazy"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {item.source}
                      </span>
                    </div>
                  </td>

                  {/* Headline */}
                  <td>
                    <div
                      className="table-title-cell"
                      onClick={() => onSelectArticle(item)}
                      title={item.title}
                    >
                      {item.title}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="col-category">
                    <span 
                      className="badge-tag default"
                      style={{ fontSize: '0.7rem', display: 'inline-block' }}
                    >
                      {item.category}
                    </span>
                  </td>

                  {/* Published Time */}
                  <td className="col-published" style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                    {item.timeAgo}
                  </td>

                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        className="action-btn-sm"
                        onClick={() => onSelectArticle(item)}
                        title="Preview"
                      >
                        <BookOpen size={13} />
                      </button>
                      <button
                        className={`action-btn-sm ${isSaved ? 'saved' : ''}`}
                        onClick={() => onToggleSave(item.id)}
                        title="Bookmark"
                      >
                        <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn-sm"
                        title="Open Source"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
