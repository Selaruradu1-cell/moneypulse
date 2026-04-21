import { T, fmt } from '../utils/data';

export default function Health({ state, lang }) {
  const t = T[lang];
  const { expenses, incomes, month, year } = state;
  const fixed = state.fixedExpenses || [];
  const monthExp = expenses.filter(e => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; }).reduce((s, e) => s + e.amount, 0);
  const fixedTotal = fixed.reduce((s, f) => s + f.amount, 0);
  const monthInc = incomes.filter(e => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; }).reduce((s, e) => s + e.amount, 0);
  const savingsRate = monthInc > 0 ? Math.max(0, (monthInc - monthExp - fixedTotal) / monthInc) : 0;
  const score = Math.round(Math.min(100, 55 + savingsRate * 90));

  const metrics = [
    { ro: 'Rată de economisire', en: 'Savings rate', value: Math.round(savingsRate * 100) + '%', score: Math.min(100, savingsRate * 200), good: 20 },
    { ro: 'Fixe / Venit', en: 'Fixed / Income', value: monthInc > 0 ? Math.round(fixedTotal / monthInc * 100) + '%' : '—', score: monthInc > 0 ? Math.max(0, 100 - (fixedTotal / monthInc) * 200) : 0, good: 40 },
    { ro: 'Fond urgență', en: 'Emergency fund', value: '3.2x', score: 75, good: 100 },
    { ro: 'Diversificare venit', en: 'Income sources', value: '3', score: 60, good: 100 },
  ];

  return (
    <div className="page fade-up">
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.health_title}</div>
            <div className="panel-sub">{t.health_page_sub}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '10px 0 20px' }}>
          <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
            <svg viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="90" cy="90" r="78" fill="none" stroke="oklch(0.98 0 0 / 0.06)" strokeWidth="12"/>
              <circle cx="90" cy="90" r="78" fill="none" stroke="var(--accent)" strokeWidth="12"
                strokeDasharray={`${(score / 100) * 490} 490`} strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 10px var(--accent-glow))' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: 44, fontWeight: 300, letterSpacing: '-0.03em', background: 'linear-gradient(180deg, #fff, var(--accent))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }} className="num">{score}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>/ 100</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.015em' }}>{lang === 'ro' ? 'Stai bine, continuă așa' : 'You\'re doing well, keep it up'}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-dim)', lineHeight: 1.6, maxWidth: 480 }}>
              {lang === 'ro'
                ? 'Scorul tău reflectă un echilibru bun între venituri, cheltuieli și economii. Concentrează-te pe reducerea cheltuielilor fixe pentru a crește rata de economisire.'
                : 'Your score reflects a healthy balance of income, spending and savings. Focus on trimming fixed costs to boost your savings rate.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {metrics.map((m, i) => (
            <div key={i} className="glass-soft" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m[lang]}</div>
                <div className="num" style={{ fontSize: 16, fontWeight: 500 }}>{m.value}</div>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width: m.score + '%' }}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
