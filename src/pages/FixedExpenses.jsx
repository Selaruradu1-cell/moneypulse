import { T, fmt } from '../utils/data';
import Icon from '../components/Icon';

export default function FixedExpenses({ state, setState, lang }) {
  const t = T[lang];
  const fixed = state.fixedExpenses || [];
  const total = fixed.reduce((s, f) => s + f.amount, 0);
  return (
    <div className="page fade-up">
      <div className="hero-grid">
        <div className="glass hero-card primary">
          <div>
            <div className="eyebrow">{t.fixed_title} · {t.monthly}</div>
            <div className="amount num">{fmt(state.conv(total), { lang })}<span className="cur">{state.cur}</span></div>
            <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>{fixed.length} {lang === 'ro' ? 'plăți recurente' : 'recurring payments'}</div>
          </div>
        </div>
        <div className="glass stat-card">
          <div>
            <div className="label">{lang === 'ro' ? 'Anual' : 'Yearly'}</div>
            <div className="value num">{fmt(state.conv(total * 12), { lang })}<span className="cur">{state.cur}</span></div>
          </div>
        </div>
        <div className="glass stat-card">
          <div>
            <div className="label">{lang === 'ro' ? 'Medie lunară' : 'Avg / bill'}</div>
            <div className="value num">{fixed.length ? fmt(state.conv(total / fixed.length), { lang }) : '0'}<span className="cur">{state.cur}</span></div>
          </div>
        </div>
      </div>
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.fixed_title}</div>
            <div className="panel-sub">{t.fixed_sub}</div>
          </div>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>{lang === 'ro' ? 'Adaugă' : 'Add'}</button>
        </div>
        {fixed.length === 0 ? (
          <div className="empty"><div className="icon">📋</div><div>{lang === 'ro' ? 'Nicio cheltuială fixă' : 'No fixed expenses'}</div></div>
        ) : [...fixed].sort((a,b)=>a.dueDay-b.dueDay).map(f => (
          <div className="row" key={f.id}>
            <div className="cat-icon" style={{ background: 'oklch(0.98 0 0 / 0.08)' }}>{f.icon}</div>
            <div>
              <div className="row-name">{f[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
              <div className="row-meta">{lang === 'ro' ? 'Ziua' : 'Day'} {f.dueDay} · {t.monthly}</div>
            </div>
            <div className="row-amt num">{fmt(state.conv(f.amount), { lang })}</div>
            <button className="row-action" onClick={() => setState({ fixedExpenses: fixed.filter(x => x.id !== f.id) })} title="delete"><Icon name="trash" size={13}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
