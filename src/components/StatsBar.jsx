import React from 'react';
import { Newspaper, Building2, Layers, Clock } from 'lucide-react';

export default function StatsBar({ articles, lastSynced }) {
  const totalStories = articles.length;

  // Calculate unique sources
  const uniqueSources = new Set(articles.map(a => a.sourceDomain || a.source)).size;

  // Calculate top category
  const categoryCounts = {};
  articles.forEach(a => {
    categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
  });

  let topCategory = 'All-Round';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  const categoryNames = {
    'ai-tech': 'AI & Tech',
    'markets': 'Markets',
    'hardware': 'Hardware',
    'cybersecurity': 'SecOps',
    'crypto': 'Crypto',
    'deals': 'Deals',
    'entertainment': 'Media',
    'general': 'General'
  };

  const formattedSyncTime = lastSynced
    ? new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Synced';

  return (
    <div className="container">
      <div className="stats-grid">
        {/* Metric 1: Total Stories */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-cyan)' }}>
            <Newspaper size={24} />
          </div>
          <div>
            <div className="stat-val">{totalStories}</div>
            <div className="stat-lbl">Ingested Stories</div>
          </div>
        </div>

        {/* Metric 2: Unique Publishers */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-violet)' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div className="stat-val">{uniqueSources}</div>
            <div className="stat-lbl">Verified Publishers</div>
          </div>
        </div>

        {/* Metric 3: Dominant Topic */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-emerald)' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.3rem', textTransform: 'capitalize' }}>
              {categoryNames[topCategory] || topCategory}
            </div>
            <div className="stat-lbl">Top Sector ({maxCount} stories)</div>
          </div>
        </div>

        {/* Metric 4: Last Feed Sync */}
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-amber)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.3rem', fontFamily: 'var(--font-mono)' }}>
              {formattedSyncTime}
            </div>
            <div className="stat-lbl">Last Sync Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
