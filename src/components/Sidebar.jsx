import { useState } from 'react';
import Icon from './Icon';
import { T } from '../utils/data';

export default function Sidebar({ page, setPage, lang, userName, setUserName, onLogout }) {
  const t = T[lang];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userName);

  const initials = (userName || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const items = [
    { id: 'dashboard', icon: 'dashboard' },
    { id: 'calendar',  icon: 'calendar' },
    { id: 'income',    icon: 'income' },
    { id: 'fixed',     icon: 'fixed' },
    { id: 'daily',     icon: 'daily' },
    { id: 'goals',     icon: 'goals' },
    { id: 'loans',     icon: 'loans' },
    { id: 'analysis',  icon: 'analysis' },
    { id: 'reports',   icon: 'reports' },
    { id: 'health',    icon: 'health' },
    { id: 'settings',  icon: 'settings' },
  ];

  const saveEdit = () => {
    if (draft.trim()) setUserName(draft.trim());
    setEditing(false);
  };

  return (
    <aside className="glass sidebar">
      <div className="brand">
        <div className="brand-mark">₽</div>
        <div>
          <div className="brand-name">MoneyPulse</div>
          <div className="brand-tag">{t.brand_tag}</div>
        </div>
      </div>
      <nav className="nav">
        {items.map((it) => (
          <button
            key={it.id}
            className={`nav-item ${page === it.id ? 'active' : ''}`}
            onClick={() => setPage(it.id)}
          >
            <span className="nav-icon"><Icon name={it.icon} size={15}/></span>
            <span className="nav-label">{t.nav[it.id]}</span>
            {it.badge && <span className="nav-badge">{it.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editing ? (
            <input
              className="user-name-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setDraft(userName); setEditing(false); } }}
              autoFocus
            />
          ) : (
            <div className="user-name" onClick={() => { setDraft(userName); setEditing(true); }} style={{ cursor: 'pointer' }} title={lang === 'ro' ? 'Click pentru a schimba numele' : 'Click to change name'}>
              {userName}
            </div>
          )}
          <div className="user-plan">Pro · RON</div>
        </div>
        {onLogout && <button className="btn btn-ghost btn-icon btn-sm" onClick={onLogout} aria-label="logout" title={lang === 'ro' ? 'Deconectare' : 'Logout'}><Icon name="x" size={14}/></button>}
      </div>
    </aside>
  );
}
