import { useState } from 'react';
import { T, fmt, fmtShort, catById, MONTHS_RO, MONTHS_EN } from '../utils/data';
import Icon from '../components/Icon';
import { Delta, Donut, AreaChart, Sparkline, Segment } from '../components/Primitives';

const clickable = { cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' };

export default function Dashboard({ state, lang, setPage, userName }) {
  const t = T[lang];
  const { expenses, incomes, month, year, conv, cur } = state;
  const [trendRange, setTrendRange] = useState('30');
  const fixed = state.fixedExpenses || [];
  const goals = state.goals || [];
  const loans = state.loans || [];
  const activeLoansTotal = loans.filter(l => !l.paid).reduce((s, l) => s + l.amount, 0);

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year;
  });
  const monthIncomes = incomes.filter(e => {
    const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year;
  });
  const fixedTotal = fixed.reduce((s, f) => s + f.amount, 0);

  const totalExp = monthExpenses.reduce((s, e) => s + e.amount, 0) + fixedTotal;
  const totalInc = monthIncomes.reduce((s, e) => s + e.amount, 0);
  const balance = totalInc - totalExp;

  const byCat = {};
  monthExpenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const segments = Object.entries(byCat)
    .map(([cid, v]) => ({ ...catById(cid), value: conv(v) }))
    .sort((a, b) => b.value - a.value);
  const catTotal = segments.reduce((s, x) => s + x.value, 0);

  const today = new Date();
  const rangeDays = parseInt(trendRange);
  const days = [];
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const sum = expenses.filter(e => e.date === key).reduce((s, e) => s + e.amount, 0);
    days.push({ label: String(d.getDate()), v: conv(sum), date: key });
  }

  const recent = [...monthExpenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const upcoming = [...fixed].sort((a, b) => a.dueDay - b.dueDay).slice(0, 4);

  const todayStr = today.toISOString().slice(0, 10);
  const todaySum = expenses.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0);

  // Previous month balance for comparison
  const prevM = month === 0 ? 11 : month - 1;
  const prevY = month === 0 ? year - 1 : year;
  const prevMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date); return d.getMonth() === prevM && d.getFullYear() === prevY;
  });
  const prevMonthIncomes = incomes.filter(e => {
    const d = new Date(e.date); return d.getMonth() === prevM && d.getFullYear() === prevY;
  });
  const prevFixedTotal = fixed.reduce((s, f) => s + f.amount, 0);
  const prevTotalExp = prevMonthExpenses.reduce((s, e) => s + e.amount, 0) + prevFixedTotal;
  const prevTotalInc = prevMonthIncomes.reduce((s, e) => s + e.amount, 0);
  const prevBalance = prevTotalInc - prevTotalExp;
  const hasPrevData = prevMonthExpenses.length > 0 || prevMonthIncomes.length > 0;
  const deltaPercent = hasPrevData && prevBalance !== 0
    ? ((balance - prevBalance) / Math.abs(prevBalance)) * 100
    : null;

  const savingsRate = totalInc > 0 ? Math.max(0, (totalInc - totalExp) / totalInc) : 0;
  const health = Math.round(Math.min(100, 55 + savingsRate * 90));

  return (
    <div className="page fade-up">
      <div className="hero-grid">
        {/* Balance → Calendar */}
        <div className="glass hero-card primary clickable" style={clickable} onClick={() => setPage('calendar')}>
          <div>
            <div className="eyebrow">{t.balance_label}</div>
            <div className="amount num">
              {balance >= 0 ? '' : '−'}{fmt(conv(Math.abs(balance)), { lang })}<span className="cur">{cur}</span>
            </div>
            {deltaPercent !== null && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Delta value={parseFloat(deltaPercent.toFixed(1))} />
                <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{t.vs_last}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <div onClick={(e) => { e.stopPropagation(); setPage('income'); }} style={clickable}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>{t.income_this_month}</div>
              <div style={{ fontSize: 18, fontWeight: 500 }} className="num">
                +{fmt(conv(totalInc), { lang })} <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{cur}</span>
              </div>
            </div>
            <div onClick={(e) => { e.stopPropagation(); setPage('daily'); }} style={clickable}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>{t.expenses_this_month}</div>
              <div style={{ fontSize: 18, fontWeight: 500 }} className="num">
                −{fmt(conv(totalExp), { lang })} <span style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{cur}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today spend → Daily */}
        <div className="glass stat-card clickable" style={clickable} onClick={() => setPage('daily')}>
          <div>
            <div className="label">{t.today_spend}</div>
            <div className="value num">{fmt(conv(todaySum), { lang })}<span className="cur">{cur}</span></div>
          </div>
          <Sparkline values={days.slice(-14).map(d => d.v || 0.5)} color="oklch(0.78 0.17 15)" />
        </div>

        {/* Health → Health page */}
        <div className="glass stat-card clickable" style={clickable} onClick={() => setPage('health')}>
          <div>
            <div className="label">{t.health}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="health-ring">
                <svg viewBox="0 0 88 88">
                  <circle cx="44" cy="44" r="38" fill="none" stroke="oklch(0.98 0 0 / 0.06)" strokeWidth="6"/>
                  <circle cx="44" cy="44" r="38" fill="none" stroke="var(--accent)" strokeWidth="6"
                    strokeDasharray={`${(health / 100) * 238.76} 238.76`}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 6px var(--accent-glow))' }}/>
                </svg>
                <div className="h-label">{health}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.4 }}>{t.health_sub}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Trend → Analysis */}
        <div className="glass panel clickable" style={clickable} onClick={() => setPage('analysis')}>
          <div className="panel-head">
            <div>
              <div className="panel-title">{t.trend_30d}</div>
              <div className="panel-sub">{fmt(days.reduce((s, d) => s + d.v, 0), { lang })} {cur} · {rangeDays} {lang === 'ro' ? 'zile' : 'days'}</div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Segment value={trendRange} onChange={setTrendRange} options={[
                { value: '7',  label: '7d' },
                { value: '30', label: '30d' },
                { value: '90', label: '90d' },
              ]}/>
            </div>
          </div>
          <AreaChart points={days} lang={lang} />
        </div>

        {/* Categories → Analysis */}
        <div className="glass panel clickable" style={clickable} onClick={() => setPage('analysis')}>
          <div className="panel-head">
            <div className="panel-title">{t.categories}</div>
            <span className="badge-pill">{segments.length}</span>
          </div>
          <div className="donut-wrap">
            <Donut segments={segments} total={catTotal} label={t.spent} />
            <div className="legend">
              {segments.slice(0, 5).map((s) => (
                <div className="legend-row" key={s.id}>
                  <span className="legend-dot" style={{ background: s.color, color: s.glow }}></span>
                  <span className="legend-name">{s[lang]}</span>
                  <span className="legend-val num">{fmt(s.value, { lang })}</span>
                  <span className="legend-pct">{catTotal > 0 ? Math.round(s.value / catTotal * 100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Recent → Daily */}
        <div className="glass panel clickable" style={clickable} onClick={() => setPage('daily')}>
          <div className="panel-head">
            <div className="panel-title">{t.recent}</div>
            <span className="btn btn-ghost btn-sm">{t.see_all}</span>
          </div>
          <div>
            {recent.map((e) => {
              const c = catById(e.category);
              return (
                <div className="row" key={e.id}>
                  <div className="cat-icon" style={{ background: c.color, '--icon-glow': c.glow }}>{c.icon}</div>
                  <div>
                    <div className="row-name">{e[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                    <div className="row-meta">{c[lang]} · {new Date(e.date).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: '2-digit', month: 'short' })}</div>
                  </div>
                  <div className="row-amt neg num">−{fmt(conv(e.amount), { lang })}</div>
                  <div style={{ width: 28 }}/>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming → Fixed */}
        <div className="glass panel clickable" style={clickable} onClick={() => setPage('fixed')}>
          <div className="panel-head">
            <div className="panel-title">{t.upcoming}</div>
            <span className="badge-pill live">Auto</span>
          </div>
          <div>
            {upcoming.map((f) => (
              <div className="row" key={f.id}>
                <div className="cat-icon" style={{ background: 'oklch(0.98 0 0 / 0.08)' }}>{f.icon}</div>
                <div>
                  <div className="row-name">{f[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                  <div className="row-meta">{lang === 'ro' ? 'Ziua' : 'Day'} {f.dueDay} · {t.monthly}</div>
                </div>
                <div className="row-amt num">{fmt(conv(f.amount), { lang })}</div>
                <div style={{ width: 28 }}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals → Goals page */}
      <div className="glass panel clickable" style={clickable} onClick={() => setPage('goals')}>
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.goals}</div>
            <div className="panel-sub">{goals.length} {lang === 'ro' ? 'obiective active' : 'active goals'}</div>
          </div>
          <span className="btn btn-ghost btn-sm">{t.see_all}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {goals.map(g => {
            const pct = Math.min(100, (g.saved / g.target) * 100);
            return (
              <div className="glass-soft" style={{ padding: 16 }} key={g.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{g[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{new Date(g.deadline).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: pct + '%' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--ink-mute)' }}>
                  <span><span className="num" style={{ color: 'var(--ink)' }}>{fmt(conv(g.saved), { lang })}</span> {t.saved_of} {fmt(conv(g.target), { lang })} {cur}</span>
                  <span>{Math.round(pct)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
