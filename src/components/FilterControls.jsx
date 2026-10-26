import React from 'react';
import { 
  Search, 
  X, 
  LayoutGrid, 
  ListFilter, 
  Globe, 
  Cpu, 
  TrendingUp, 
  HardDrive, 
  Shield, 
  Coins, 
  Tag, 
  Gamepad2, 
  Newspaper
} from 'lucide-react';
import { CATEGORIES } from '../utils/newsParser';

const categoryIcons = {
  all: Globe,
  'ai-tech': Cpu,
  markets: TrendingUp,
  hardware: HardDrive,
  cybersecurity: Shield,
  crypto: Coins,
  deals: Tag,
  entertainment: Gamepad2,
  general: Newspaper
};

export default function FilterControls({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedSource,
  onSelectSource,
  availableSources,
  categoryCounts,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) {
  return (
    <div className="container">
      <div className="filter-panel">
        {/* Row 1: Search Bar, Publisher Dropdown, Sort Dropdown & Listing Mode Toggle */}
        <div className="search-row">
          {/* Search Bar */}
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search news by headline, keyword, or snippet..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear" 
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Source / Publisher Dropdown Filter */}
          <div className="source-select-wrap">
            <select
              className="custom-select"
              value={selectedSource}
              onChange={(e) => onSelectSource(e.target.value)}
              title="Filter by News Publisher"
            >
              <option value="all">All Publishers ({availableSources.length})</option>
              {availableSources.map((src) => (
                <option key={src.name} value={src.name}>
                  {src.name} ({src.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ minWidth: '160px' }}>
            <select
              className="custom-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              title="Sort Articles"
            >
              <option value="newest">Latest Published</option>
              <option value="oldest">Earliest Published</option>
              <option value="title">Headline (A &rarr; Z)</option>
              <option value="source">Publisher (A &rarr; Z)</option>
            </select>
          </div>

          {/* Listing Option: Grid Cards View vs Dense Table View */}
          <div className="view-mode-group">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid Cards View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Dense Terminal Feed View"
            >
              <ListFilter size={18} />
            </button>
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="category-scroll">
          {CATEGORIES.map((cat) => {
            const Icon = categoryIcons[cat.id] || Newspaper;
            const count = categoryCounts[cat.id] || 0;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                className={`cat-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <Icon size={15} style={{ color: isActive ? 'var(--accent-cyan)' : cat.color }} />
                <span>{cat.label}</span>
                <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
