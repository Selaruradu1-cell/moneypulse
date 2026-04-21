import { T, fmt } from '../utils/data';
import Icon from '../components/Icon';

export default function Goals({ state, setState, lang }) {
  const t = T[lang];
  const goals = state.goals || [];
  return (
    <div className="page fade-up">
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.goals_title}</div>
            <div className="panel-sub">{t.goals_sub}</div>
          </div>
          <button className="btn btn-primary"><Icon name="plus" size={14}/>{lang === 'ro' ? 'Obiectiv nou' : 'New goal'}</button>
        </div>
        {goals.length === 0 ? (
          <div className="empty"><div className="icon">🎯</div><div>{lang === 'ro' ? 'Niciun obiectiv' : 'No goals yet'}</div></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {goals.map(g => {
              const pct = Math.min(100, (g.saved / g.target) * 100);
              const remaining = g.target - g.saved;
              return (
                <div className="glass-soft" style={{ padding: 20 }} key={g.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{g[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 2 }}>{lang === 'ro' ? 'Termen' : 'By'} {new Date(g.deadline).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-0.02em' }} className="num">{Math.round(pct)}%</div>
                  </div>
                  <div className="progress"><div className="progress-fill" style={{ width: pct + '%' }}/></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
                    <span style={{ color: 'var(--ink-mute)' }}><span className="num" style={{ color: 'var(--ink)' }}>{fmt(state.conv(g.saved), { lang })}</span> / {fmt(state.conv(g.target), { lang })} {state.cur}</span>
                    <span style={{ color: 'var(--ink-mute)' }}>−{fmt(state.conv(remaining), { lang })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
