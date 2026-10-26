import React from 'react';
import { Flame } from 'lucide-react';

export default function TickerBar({ articles, onSelectArticle }) {
  if (!articles || articles.length === 0) return null;

  // Use the top 10 articles for the ticker
  const tickerArticles = articles.slice(0, 10);
  // Duplicate for seamless infinite loop
  const displayList = [...tickerArticles, ...tickerArticles];

  return (
    <div className="ticker-container" aria-label="Breaking News Ticker">
      <div className="ticker-label">
        <Flame size={14} />
        <span>Live Wire</span>
      </div>
      <div className="ticker-content">
        {displayList.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="ticker-item"
            onClick={() => onSelectArticle(item)}
            title="Click to preview article"
          >
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {item.source}
            </span>
            <span>&bull;</span>
            <span>{item.title}</span>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
    </div>
  );
}
