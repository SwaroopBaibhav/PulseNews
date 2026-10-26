import React from 'react';
import { ExternalLink, Database, Layers } from 'lucide-react';
import { SHEET_ID, LIVE_GID } from '../services/sheetService';

export default function Footer() {
  const originalSheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${LIVE_GID}#gid=${LIVE_GID}`;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              <Layers size={18} style={{ color: 'var(--accent-cyan)' }} />
              PulseNews Intelligence Platform
            </div>
            <p style={{ color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.5 }}>
              Clean, real-time display portal connected directly to your automated Google Apps Script pipeline.
            </p>
          </div>

          <div className="footer-links">
            <a 
              href={originalSheetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Database size={15} /> Source Google Sheet <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div style={{ 
          marginTop: '28px', 
          paddingTop: '20px', 
          borderTop: '1px solid var(--surface-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          color: 'var(--text-muted)',
          fontSize: '0.8rem'
        }}>
          <div>&copy; {new Date().getFullYear()} PulseNews. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Powered by Google Sheets Automation &bull; React 19
          </div>
        </div>
      </div>
    </footer>
  );
}
