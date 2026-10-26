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
            <Radio size={24} />
          </div>
          <div className="logo-text">
            <h1>
              PulseNews <span className="logo-badge">Pipeline</span>
            </h1>
            <div className="logo-subtitle">Real-Time News Stream &bull; Powered by Google Sheets</div>
          </div>
        </div>

        {/* Feed Switcher Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--surface-border)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          gap: '4px'
        }}>
          {/* Live Feed Tab */}
          <button
            onClick={() => onTabChange('live')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'live' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              background: activeTab === 'live' ? 'rgba(0, 210, 255, 0.15)' : 'transparent',
              border: activeTab === 'live' ? '1px solid rgba(0, 210, 255, 0.35)' : '1px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <Flame size={15} style={{ color: activeTab === 'live' ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
            <span>Latest News</span>
            <span style={{
              fontSize: '0.72rem',
              background: 'rgba(125, 125, 125, 0.16)',
              padding: '1px 7px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)'
            }}>
              {liveCount}
            </span>
          </button>

          {/* Old News Archive Tab */}
          <button
            onClick={() => onTabChange('archive')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: activeTab === 'archive' ? 'var(--accent-violet)' : 'var(--text-secondary)',
              background: activeTab === 'archive' ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
              border: activeTab === 'archive' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            <Archive size={15} style={{ color: activeTab === 'archive' ? 'var(--accent-violet)' : 'var(--text-muted)' }} />
            <span>Old News Archive</span>
            <span style={{
              fontSize: '0.72rem',
              background: 'rgba(125, 125, 125, 0.16)',
              padding: '1px 7px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)'
            }}>
              {archiveCount}
            </span>
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
            <span>
              {dataSource === 'live' ? 'Live Stream' : 'Cached'}
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
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
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
