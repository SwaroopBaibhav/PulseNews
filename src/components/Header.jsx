import React from 'react';
import { 
  Radio, 
  RotateCw, 
  Bookmark, 
  Moon, 
  Sun, 
  Zap,
  Archive,
  Flame
} from 'lucide-react';

export default function Header({
  activeTab,
  onTabChange,
  dataSource,
  liveCount,
  archiveCount,
  latencyMs,
  isRefreshing,
  onRefresh,
  autoRefresh,
  onToggleAutoRefresh,
  savedCount,
  showSavedOnly,
  onToggleSavedOnly,
  theme,
  onToggleTheme
}) {
  return (
    <header className="header-wrapper">
      <div className="container header-inner">
        {/* Brand Logo */}
        <div className="logo-group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-icon-wrap">
            <Radio size={22} />
          </div>
          <div className="logo-text">
            <h1>
              PulseNews <span className="logo-badge">Pipeline</span>
            </h1>
            <div className="logo-subtitle">Real-Time News Stream &bull; Powered by Google Sheets</div>
          </div>
        </div>

        {/* Feed Switcher Tabs */}
        <div className="tab-switcher">
          {/* Live Feed Tab */}
          <button
            onClick={() => onTabChange('live')}
            className={`tab-btn ${activeTab === 'live' ? 'active-live' : ''}`}
            title="Switch to Latest News Feed"
          >
            <Flame size={15} className="tab-icon" />
            <span className="tab-btn-label">Latest News</span>
            <span className="tab-count-pill">{liveCount}</span>
          </button>

          {/* Old News Archive Tab */}
          <button
            onClick={() => onTabChange('archive')}
            className={`tab-btn ${activeTab === 'archive' ? 'active-archive' : ''}`}
            title="Switch to Historical News Archive"
          >
            <Archive size={15} className="tab-icon" />
            <span className="tab-btn-label">Old News Archive</span>
            <span className="tab-count-pill">{archiveCount}</span>
          </button>
        </div>

        {/* Status & Actions */}
        <div className="header-actions">
          {/* Live Data Connection Badge */}
          <div 
            className={`sync-badge ${dataSource !== 'live' ? 'cached' : ''}`}
            title={dataSource === 'live' ? `Live Google Sheet stream (${latencyMs}ms)` : 'Cached / Snapshot mode'}
          >
            <span className="pulse-dot" />
            <span className="sync-badge-text">
              {dataSource === 'live' ? 'Live' : 'Cached'}
            </span>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            className={`btn-icon ${autoRefresh ? 'active' : ''}`}
            onClick={onToggleAutoRefresh}
            title={autoRefresh ? 'Auto-sync ON (60s)' : 'Auto-sync OFF'}
          >
            <Zap size={18} />
          </button>

          {/* Manual Refresh Button */}
          <button 
            className="btn-refresh" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            title="Refresh feed from Google Spreadsheet"
          >
            <RotateCw size={16} className={isRefreshing ? 'spin-icon' : ''} />
            <span className="btn-refresh-text">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Bookmarks Toggle */}
          <button
            className={`btn-icon ${showSavedOnly ? 'active' : ''}`}
            onClick={onToggleSavedOnly}
            title="View Saved Bookmarks"
          >
            <Bookmark size={18} />
            {savedCount > 0 && <span className="badge-counter">{savedCount}</span>}
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn-icon" 
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
