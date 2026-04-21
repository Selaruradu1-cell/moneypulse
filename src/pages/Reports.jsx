import { T } from '../utils/data';

export default function Reports({ state, lang }) {
  const t = T[lang];
  return (
    <div className="page fade-up">
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.reports_title}</div>
            <div className="panel-sub">{t.reports_sub}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { ro: 'Raport lunar', en: 'Monthly report', icon: '📊', fmt: 'PDF · 4 pag' },
            { ro: 'Export CSV', en: 'CSV export', icon: '📋', fmt: 'CSV · 180 rânduri' },
            { ro: 'Declarație fiscală', en: 'Tax statement', icon: '📑', fmt: 'PDF · 2 pag' },
            { ro: 'Trend anual', en: 'Yearly trend', icon: '📈', fmt: 'PDF · 6 pag' },
          ].map((r, i) => (
            <div key={i} className="glass-soft" style={{ padding: 18, cursor: 'pointer' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{r.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{r[lang]}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{r.fmt}</div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>{lang === 'ro' ? 'Descarcă' : 'Download'}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
