import Papa from 'papaparse';

// Category Definitions with color tokens and icons
export const CATEGORIES = [
  { id: 'all', label: 'All Stories', icon: 'Globe', color: '#00d2ff' },
  { id: 'ai-tech', label: 'AI & Deep Tech', icon: 'Cpu', color: '#8b5cf6' },
  { id: 'markets', label: 'Markets & Economy', icon: 'TrendingUp', color: '#10b981' },
  { id: 'hardware', label: 'Hardware & Chips', icon: 'HardDrive', color: '#f59e0b' },
  { id: 'cybersecurity', label: 'Cybersecurity & Dev', icon: 'Shield', color: '#ec4899' },
  { id: 'crypto', label: 'Crypto & Web3', icon: 'Coins', color: '#6366f1' },
  { id: 'deals', label: 'Deals & Consumer', icon: 'Tag', color: '#14b8a6' },
  { id: 'entertainment', label: 'Entertainment & Gaming', icon: 'Gamepad2', color: '#f43f5e' },
  { id: 'general', label: 'General News', icon: 'Newspaper', color: '#64748b' }
];

const KNOWN_DOMAINS = {
  'the new york times': 'nytimes.com',
  'new york times': 'nytimes.com',
  'the guardian': 'theguardian.com',
  'cnn': 'cnn.com',
  'bbc': 'bbc.com',
  'bbc news': 'bbc.com',
  'reuters': 'reuters.com',
  'ap news': 'apnews.com',
  'associated press': 'apnews.com',
  'the washington post': 'washingtonpost.com',
  'washington post': 'washingtonpost.com',
  'politico': 'politico.com',
  'abc news': 'abcnews.go.com',
  'cbs news': 'cbsnews.com',
  'nbc news': 'nbcnews.com',
  'fox news': 'foxnews.com',
  'bloomberg': 'bloomberg.com',
  'forbes': 'forbes.com',
  'wall street journal': 'wsj.com',
  'wsj': 'wsj.com',
  'the hill': 'thehill.com',
  'usa today': 'usatoday.com',
  'los angeles times': 'latimes.com',
  'la times': 'latimes.com',
  'the verge': 'theverge.com',
  'engadget': 'engadget.com',
  'techcrunch': 'techcrunch.com',
  'wired': 'wired.com',
  'arstechnica': 'arstechnica.com',
  'gizmodo': 'gizmodo.com',
  'nasa': 'nasa.gov',
  'nasa science': 'nasa.gov',
  'espn': 'espn.com',
  'the hollywood reporter': 'hollywoodreporter.com',
  'deadline': 'deadline.com',
  'variety': 'variety.com',
  'cnbc': 'cnbc.com',
  'marketwatch': 'marketwatch.com',
  'barron\'s': 'barrons.com',
  'yahoo': 'yahoo.com',
  'axios': 'axios.com'
};

export function detectCategory(source = '', title = '', snippet = '') {
  const text = `${source} ${title} ${snippet}`.toLowerCase();

  // AI & Deep Tech (Science, Space, AI)
  if (
    /(\bai\b|artificial intelligence|machine learning|llm|deepseek|chatgpt|openai|anthropic|agentic|neural|robotics|autonomous|driverless|spacex|nasa|astronomy|telescope|quantum|biotech|genetics|dna|crispr|science|scientist)/i.test(text)
  ) {
    return 'ai-tech';
  }

  // Crypto & Web3
  if (
    /(crypto|bitcoin|ethereum|blockchain|tokenized|web3|solana|binance|coinbase|wallet|defi|nft)/i.test(text)
  ) {
    return 'crypto';
  }

  // Cybersecurity & Dev
  if (
    /(cybersecurity|hacker|malware|ransomware|vulnerability|firewall|exploit|patch|phishing|2fa|authentication|github|visual studio|debugger|codebase|programming|linux|kernel|devops|data breach)/i.test(text)
  ) {
    return 'cybersecurity';
  }

  // Hardware & Chips
  if (
    /(nvidia|intel|amd|tsmc|qualcomm|gpu|cpu|semiconductor|processor|macbook|iphone|ipad|apple|samsung|galaxy|snapdragon|hardware|chips|camera|laptop|headphones|monitor|display)/i.test(text)
  ) {
    return 'hardware';
  }

  // Entertainment, Gaming & Sports
  if (
    /(nintendo|playstation|xbox|gaming|gameplay|steam|marvel|movie|film|trailer|series|actor|actress|hollywood|oscar|emmy|grammy|concert|music|album|song|spotify|netflix|disney|hbo|tv show|football|nfl|nba|mlb|soccer|sports|tournament|championship|celebrity|dancing with the stars)/i.test(text)
  ) {
    return 'entertainment';
  }

  // Deals & Consumer Shopping
  if (
    /(\bdeal\b|\bdeals\b|discount|savings|coupon|cashback|sale\b|black friday|prime day|best price|promo code|clearance|rebate)/i.test(text)
  ) {
    return 'deals';
  }

  // Markets, Economy & Business
  if (
    /(stocks|shares|wall street|nasdaq|s&p 500|dow jones|investor|investing|funding|revenue|earnings|quarterly|ipo|dividend|market|inflation|tariffs|fed\b|interest rate|economy|recession|acquisition|merger|secures|debt|gdp|bank|treasury|financial)/i.test(text)
  ) {
    return 'markets';
  }

  return 'general';
}

export function detectBadge(title = '', snippet = '', category = '') {
  const text = `${title} ${snippet}`.toLowerCase();
  if (text.includes('breaking') || text.includes('alert') || text.includes('urgent') || text.includes('bombs') || text.includes('coup')) return 'Breaking';
  if (text.includes('deal') || text.includes('discount') || text.includes('off') || text.includes('match') || text.includes('black friday')) return 'Hot Deal';
  if (category === 'ai-tech') return 'AI / Science';
  if (category === 'cybersecurity') return 'Sec Ops';
  if (category === 'markets' && (text.includes('cuts') || text.includes('gains') || text.includes('top picks') || text.includes('inflation') || text.includes('stocks'))) return 'Market Alert';
  if (category === 'entertainment') return 'Culture & Play';
  if (category === 'hardware') return 'Tech Radar';
  if (category === 'crypto') return 'Web3 Pulse';
  if (text.includes('why') || text.includes('how') || text.includes('analysis') || text.includes('reveals') || text.includes('history')) return 'Deep Dive';
  return 'Top Story';
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'Historical';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // If recent
    if (diffMs > 0 && diffMs < 86400000 * 2) {
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      if (diffMin < 2) return 'Just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHour < 24) return `${diffHour}h ago`;
      return 'Yesterday';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (err) {
    return dateString;
  }
}

export function estimateReadTime(text = '') {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const time = Math.ceil(words / 45);
  return Math.max(1, time);
}

export function parseNewsCsv(csvString, isArchive = false) {
  if (!csvString || typeof csvString !== 'string') {
    return [];
  }

  const parsed = Papa.parse(csvString, {
    skipEmptyLines: true,
    fastMode: false
  });

  const rows = parsed.data || [];
  if (rows.length < 2) {
    return [];
  }

  // Detect Schema: Check header columns
  const firstRow = rows[0].map(c => String(c || '').trim().toLowerCase());
  const isSheet1Archive = firstRow.includes('publisher') && firstRow.includes('body');

  let titleCol = 2;
  let sourceCol = 1;
  let urlCol = 3;
  let pubDateCol = 4;
  let snippetCol = 5;
  let updDateCol = 0;

  if (isSheet1Archive) {
    // Sheet1 schema: ["Date", "Source" (Headline), "Body", "Publisher", "Link"]
    updDateCol = 0;
    pubDateCol = 0;
    titleCol = 1;
    snippetCol = 2;
    sourceCol = 3;
    urlCol = 4;
  } else {
    // Sheet2 schema: ["Date Of Updation", "Source", "Title", "URL", "Published Date", "Snippet"]
    firstRow.forEach((col, idx) => {
      if (col.includes('source') && !isSheet1Archive) sourceCol = idx;
      else if (col.includes('title')) titleCol = idx;
      else if (col.includes('url') || col.includes('link')) urlCol = idx;
      else if (col.includes('published')) pubDateCol = idx;
      else if (col.includes('snippet') || col.includes('body') || col.includes('summary')) snippetCol = idx;
      else if (col.includes('date') || col.includes('updation')) updDateCol = idx;
    });
  }

  const articles = [];
  const seenUrls = new Set();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    let title = (row[titleCol] || '').trim();
    const url = (row[urlCol] || '').trim();
    if (!title && !url) continue;

    // Deduplicate
    const key = url || title;
    if (seenUrls.has(key)) continue;
    seenUrls.add(key);

    let source = (row[sourceCol] || '').trim();
    if (isSheet1Archive && !source) {
      // Extract publisher from title if e.g. "Headline - The New York Times"
      const dashParts = title.split(' - ');
      if (dashParts.length > 1) {
        source = dashParts[dashParts.length - 1].trim();
      } else {
        source = 'News Archive';
      }
    }

    // Clean source name
    source = source.replace(/^https?:\/\//i, '').replace(/\/.*$/, '') || 'Archive Outlet';

    const publishedDate = (row[pubDateCol] || '').trim();
    const dateUpdated = (row[updDateCol] || '').trim();
    
    // Clean snippet
    let snippet = (row[snippetCol] || '').trim();
    if (isSheet1Archive && snippet) {
      const parts = snippet.split(/\s{3,}/).map(p => p.trim()).filter(Boolean);
      if (parts.length > 1) {
        snippet = parts.slice(0, 3).join(' • ');
      } else if (parts.length === 1) {
        snippet = parts[0];
      }
    }

    const category = detectCategory(source, title, snippet);
    const badge = detectBadge(title, snippet, category);
    const timeAgo = formatRelativeTime(publishedDate || dateUpdated);
    const readTime = estimateReadTime(snippet);

    // Resolve high-resolution favicon
    const sLower = source.toLowerCase().trim();
    const matchedDomain = KNOWN_DOMAINS[sLower] || Object.entries(KNOWN_DOMAINS).find(([k]) => sLower.includes(k))?.[1];
    const cleanDomain = matchedDomain || (source.includes('.') ? source : `${source.replace(/[^a-zA-Z0-9.-]/g, '')}.com`);
    const favicon = cleanDomain ? `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64` : null;

    articles.push({
      id: `${isArchive || isSheet1Archive ? 'old' : 'live'}-${i}-${Math.abs(hashString(url || title))}`,
      title,
      url: url.startsWith('http') ? url : `https://${url}`,
      source,
      sourceDomain: cleanDomain,
      favicon,
      publishedDate,
      dateUpdated,
      snippet,
      category,
      badge,
      timeAgo,
      readTime,
      isArchive: isArchive || isSheet1Archive
    });
  }

  return articles;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
