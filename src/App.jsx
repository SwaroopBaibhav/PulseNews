import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TickerBar from './components/TickerBar';
import StatsBar from './components/StatsBar';
import HeroSpotlight from './components/HeroSpotlight';
import FilterControls from './components/FilterControls';
import NewsCard from './components/NewsCard';
import NewsTable from './components/NewsTable';
import ArticleModal from './components/ArticleModal';
import Footer from './components/Footer';
import { fetchLiveNews, fetchArchiveNews } from './services/sheetService';
import { Bookmark, Inbox, ChevronDown } from 'lucide-react';

const PAGE_SIZE = 24;

export default function App() {
  // Theme state: defaults to 'light' (white theme)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('rag_news_theme_v2');
    if (saved) return saved;
    return 'light';
  });

  // Active Feed Tab: 'live' (Latest News) or 'archive' (Old News Archive)
  const [activeTab, setActiveTab] = useState('live');

  // News Data State
  const [liveArticles, setLiveArticles] = useState([]);
  const [archiveArticles, setArchiveArticles] = useState([]);
  const [dataSource, setDataSource] = useState('live');
  const [latencyMs, setLatencyMs] = useState(0);
  const [lastSynced, setLastSynced] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Progressive Rendering Count to prevent DOM freeze lag
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // User Preferences & Filters
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Bookmarks state
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('rag_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reader Modal State
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Apply Theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rag_news_theme_v2', theme);
    localStorage.setItem('rag_news_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch News from both sheets
  const loadAllNews = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);

    try {
      const [liveRes, archiveRes] = await Promise.all([
        fetchLiveNews(),
        fetchArchiveNews()
      ]);

      setLiveArticles(liveRes.articles);
      setArchiveArticles(archiveRes.articles);
      setDataSource(liveRes.source === 'live' || archiveRes.source === 'live' ? 'live' : 'cache');
      setLatencyMs(liveRes.latencyMs || archiveRes.latencyMs || 0);
      setLastSynced(liveRes.lastSynced || archiveRes.lastSynced);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      if (isManual) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllNews(false);
  }, [loadAllNews]);

  // Auto-refresh interval (every 60s for live feed)
  useEffect(() => {
    if (!autoRefresh) return;
    const intervalId = setInterval(() => {
      loadAllNews(false);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [autoRefresh, loadAllNews]);

  // Active articles list depending on selected tab
  const currentArticles = useMemo(() => {
    return activeTab === 'archive' ? archiveArticles : liveArticles;
  }, [activeTab, archiveArticles, liveArticles]);

  // Instant zero-lag tab switching
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedCategory('all');
    setSelectedSource('all');
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
  }, []);

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeTab, selectedCategory, selectedSource, searchQuery, showSavedOnly]);

  // Bookmarks Handler
  const toggleSave = useCallback((id) => {
    setSavedIds(prev => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter(item => item !== id);
      } else {
        updated = [...prev, id];
      }
      try {
        localStorage.setItem('rag_saved_articles', JSON.stringify(updated));
      } catch (e) { }
      return updated;
    });
  }, []);

  // Compute available sources and counts for active dataset
  const availableSources = useMemo(() => {
    const counts = {};
    currentArticles.forEach(a => {
      const src = a.source || 'Unknown';
      counts[src] = (counts[src] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [currentArticles]);

  // Compute category counts for active dataset
  const categoryCounts = useMemo(() => {
    const counts = { all: currentArticles.length };
    currentArticles.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [currentArticles]);

  // Filter & Sort Articles
  const filteredArticles = useMemo(() => {
    let list = [...currentArticles];

    // Saved only filter
    if (showSavedOnly) {
      list = list.filter(a => savedIds.includes(a.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(a => a.category === selectedCategory);
    }

    // Source filter
    if (selectedSource !== 'all') {
      list = list.filter(a => a.source === selectedSource);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.snippet && a.snippet.toLowerCase().includes(q)) ||
        a.source.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = new Date(a.publishedDate || a.dateUpdated).getTime() || 0;
        const timeB = new Date(b.publishedDate || b.dateUpdated).getTime() || 0;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = new Date(a.publishedDate || a.dateUpdated).getTime() || 0;
        const timeB = new Date(b.publishedDate || b.dateUpdated).getTime() || 0;
        return timeA - timeB;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'source') {
        return a.source.localeCompare(b.source);
      }
      return 0;
    });

    return list;
  }, [currentArticles, showSavedOnly, savedIds, selectedCategory, selectedSource, searchQuery, sortBy]);

  // Paginated/windowed slice of articles for instantaneous 60fps rendering
  const paginatedArticles = useMemo(() => {
    return filteredArticles.slice(0, visibleCount);
  }, [filteredArticles, visibleCount]);

  const hasMore = visibleCount < filteredArticles.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  // Featured Spotlight Article
  const spotlightArticle = useMemo(() => {
    if (showSavedOnly || searchQuery || selectedCategory !== 'all' || selectedSource !== 'all') {
      return null;
    }
    return currentArticles.find(a => a.snippet && a.snippet.length > 50) || currentArticles[0] || null;
  }, [currentArticles, showSavedOnly, searchQuery, selectedCategory, selectedSource]);

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        dataSource={dataSource}
        liveCount={liveArticles.length}
        archiveCount={archiveArticles.length}
        latencyMs={latencyMs}
        isRefreshing={isRefreshing}
        onRefresh={() => loadAllNews(true)}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(p => !p)}
        savedCount={savedIds.length}
        showSavedOnly={showSavedOnly}
        onToggleSavedOnly={() => setShowSavedOnly(p => !p)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Breaking News Ticker */}
      <TickerBar
        articles={liveArticles.length > 0 ? liveArticles : archiveArticles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      <main style={{ minHeight: 'calc(100vh - 250px)' }}>
        {/* KPI Intelligence Stats Bar */}
        <StatsBar
          articles={currentArticles}
          lastSynced={lastSynced}
        />

        {/* Hero Spotlight */}
        {spotlightArticle && (
          <HeroSpotlight
            article={spotlightArticle}
            onSelectArticle={(art) => setSelectedArticle(art)}
            isSaved={savedIds.includes(spotlightArticle.id)}
            onToggleSave={toggleSave}
          />
        )}

        {/* Search, Category & Listing Mode Filter Controls */}
        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          availableSources={availableSources}
          categoryCounts={categoryCounts}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Section Header */}
        <div className="container">
          <div className="section-meta-row">
            <div className="section-title">
              <span>
                {showSavedOnly
                  ? 'Saved Bookmarks'
                  : activeTab === 'archive'
                    ? 'Historical News Archive'
                    : 'Latest News Feed'}
              </span>
              <span className="results-badge">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Story' : 'Stories'}
              </span>
            </div>
            {showSavedOnly && (
              <button
                className="btn-secondary"
                onClick={() => setShowSavedOnly(false)}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                Back to Feed
              </button>
            )}
          </div>
        </div>

        {/* Content Stream: Card Grid vs Dense Table */}
        {currentArticles.length === 0 ? (
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">
                <Inbox size={48} />
              </div>
              <h3 className="empty-title">
                {activeTab === 'live' ? 'Latest News Feed is Currently Empty' : 'Old News Archive is Empty'}
              </h3>
              <p style={{ maxWidth: '500px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                {activeTab === 'live'
                  ? 'No articles are currently in the live feed. Once your automated Google Apps Script pipeline runs its next batch, fresh news stories will stream here in real time.'
                  : 'No archived records found in the archive.'}
              </p>
              {activeTab === 'live' && archiveArticles.length > 0 && (
                <button
                  className="btn-primary"
                  onClick={() => handleTabChange('archive')}
                  style={{ fontSize: '0.85rem' }}
                >
                  Explore Old News Archive ({archiveArticles.length} stories)
                </button>
              )}
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="container">
            <div className="empty-state">
              <div className="empty-icon">
                {showSavedOnly ? <Bookmark size={48} /> : <Inbox size={48} />}
              </div>
              <h3 className="empty-title">
                {showSavedOnly ? 'No Saved Stories Yet' : 'No Matching Articles Found'}
              </h3>
              <p>
                {showSavedOnly
                  ? 'Bookmark stories to view them in your personal reading list.'
                  : 'Try adjusting your search keywords, clearing your filters, or switching categories.'}
              </p>
              {(searchQuery || selectedCategory !== 'all' || selectedSource !== 'all') && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedSource('all');
                  }}
                  style={{ marginTop: '16px' }}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="container">
            <div className="news-grid">
              {paginatedArticles.map(article => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onSelectArticle={(art) => setSelectedArticle(art)}
                  isSaved={savedIds.includes(article.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div style={{ textAlign: 'center', margin: '16px 0 48px' }}>
                <button
                  className="btn-secondary"
                  onClick={handleLoadMore}
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ChevronDown size={18} />
                  <span>Load More Stories ({paginatedArticles.length} of {filteredArticles.length})</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="container">
            <NewsTable
              articles={paginatedArticles}
              onSelectArticle={(art) => setSelectedArticle(art)}
              savedIds={savedIds}
              onToggleSave={toggleSave}
            />

            {/* Load More Button for Table Mode */}
            {hasMore && (
              <div style={{ textAlign: 'center', margin: '16px 0 48px' }}>
                <button
                  className="btn-secondary"
                  onClick={handleLoadMore}
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ChevronDown size={18} />
                  <span>Load More Stories ({paginatedArticles.length} of {filteredArticles.length})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reader Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isSaved={savedIds.includes(selectedArticle.id)}
          onToggleSave={toggleSave}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
