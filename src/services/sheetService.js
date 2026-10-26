import { initialCsvRaw } from '../data/initialCsv';
import { initialArchiveCsvRaw } from '../data/initialArchiveCsv';
import { parseNewsCsv } from '../utils/newsParser';

export const SHEET_ID = '1gI5Pvf6m7hL2qZioeEhZY0GiXPrRxA6b4hpvrxewtL8';
export const LIVE_GID = '1084328196';    // Sheet2 (Latest News)
export const ARCHIVE_GID = '0';          // Sheet1 (Old News Archive)

export function getSheetCsvUrl(gid = LIVE_GID) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

async function fetchFromSheetUrl(url, proxyFallbackUrl) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'text/csv,text/plain,*/*' }
    });
  } catch (directErr) {
    if (proxyFallbackUrl) {
      response = await fetch(proxyFallbackUrl, {
        signal: controller.signal,
        headers: { 'Accept': 'text/csv,text/plain,*/*' }
      });
    } else {
      throw directErr;
    }
  }
  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Google Sheets responded with HTTP ${response.status}`);
  }

  const text = await response.text();
  if (text.includes('<html') && text.includes('Sign in to your Google Account')) {
    throw new Error('Google Sheet returned a sign-in redirect. Ensure "Anyone with the link can view" is enabled.');
  }

  return text;
}

export async function fetchLiveNews() {
  const url = getSheetCsvUrl(LIVE_GID);
  const proxyUrl = `/google-sheet/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${LIVE_GID}`;
  const startTime = performance.now();

  try {
    const csvText = await fetchFromSheetUrl(url, proxyUrl);
    // Parse whatever is in Sheet2 (if empty, articles is [])
    const articles = parseNewsCsv(csvText, false);

    const latencyMs = Math.round(performance.now() - startTime);
    const lastSynced = new Date().toISOString();

    try {
      localStorage.setItem('rag_news_cached_csv', csvText);
      localStorage.setItem('rag_news_last_synced', lastSynced);
    } catch (e) {}

    return {
      articles: articles || [],
      source: 'live',
      lastSynced,
      latencyMs,
      error: null
    };
  } catch (err) {
    console.warn('Live news fetch network error, checking fallback:', err.message);

    try {
      const cached = localStorage.getItem('rag_news_cached_csv');
      const cachedSync = localStorage.getItem('rag_news_last_synced');
      if (cached) {
        const cachedArticles = parseNewsCsv(cached, false);
        return {
          articles: cachedArticles || [],
          source: 'cache',
          lastSynced: cachedSync || new Date().toISOString(),
          latencyMs: 0,
          error: null
        };
      }
    } catch (cacheErr) {}

    const bundledArticles = parseNewsCsv(initialCsvRaw, false);
    return {
      articles: bundledArticles,
      source: 'bundled',
      lastSynced: '2026-10-25T17:00:00Z',
      latencyMs: 0,
      error: null
    };
  }
}

export async function fetchArchiveNews() {
  const url = getSheetCsvUrl(ARCHIVE_GID);
  const proxyUrl = `/google-sheet/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${ARCHIVE_GID}`;
  const startTime = performance.now();

  try {
    const csvText = await fetchFromSheetUrl(url, proxyUrl);
    const articles = parseNewsCsv(csvText, true);

    const latencyMs = Math.round(performance.now() - startTime);
    const lastSynced = new Date().toISOString();

    try {
      localStorage.setItem('rag_archive_cached_csv', csvText);
      localStorage.setItem('rag_archive_last_synced', lastSynced);
    } catch (e) {}

    return {
      articles: articles || [],
      source: 'live',
      lastSynced,
      latencyMs,
      error: null
    };
  } catch (err) {
    console.warn('Archive fetch network error, checking fallback:', err.message);

    try {
      const cached = localStorage.getItem('rag_archive_cached_csv');
      const cachedSync = localStorage.getItem('rag_archive_last_synced');
      if (cached) {
        const cachedArticles = parseNewsCsv(cached, true);
        return {
          articles: cachedArticles || [],
          source: 'cache',
          lastSynced: cachedSync || new Date().toISOString(),
          latencyMs: 0,
          error: null
        };
      }
    } catch (cacheErr) {}

    const bundledArticles = parseNewsCsv(initialArchiveCsvRaw, true);
    return {
      articles: bundledArticles,
      source: 'bundled',
      lastSynced: '2025-11-28T13:00:00Z',
      latencyMs: 0,
      error: null
    };
  }
}
