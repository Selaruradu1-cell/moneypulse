import { T, fmt, fmtShort, catById } from '../utils/data';

export default function CalendarPage({ state, lang, setPage }) {
  const t = T[lang];
  const { expenses, incomes, month, year } = state;
  const fixed = state.fixedExpenses || [];

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDay = firstDay.getDay() - 1; if (startDay < 0) startDay = 6;

  const expByDay = {}, incByDay = {};
  expenses.forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      (expByDay[day] = expByDay[day] || []).push(e);
    }
  });
  incomes.forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      (incByDay[day] = incByDay[day] || []).push(e);
    }
  });

  const maxExp = Math.max(1, ...Object.values(expByDay).map(arr => arr.reduce((s, e) => s + e.amount, 0)));
  const intensityOf = (sum) => {
    if (!sum) return 0;
    const r = sum / maxExp;
    if (r < 0.15) return 1;
    if (r < 0.35) return 2;
    if (r < 0.65) return 3;
    return 4;
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push({ empty: true, key: 'e' + i });
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const exps = expByDay[d] || [];
    const incs = incByDay[d] || [];
    cells.push({
      day: d, iso,
      expSum: exps.reduce((s, e) => s + e.amount, 0),
      incSum: incs.reduce((s, e) => s + e.amount, 0),
      expCats: [...new Set(exps.map(e => e.category))],
      isToday: iso === todayStr,
      key: 'd' + d,
    });
  }

  const monthExp = Object.values(expByDay).flat().reduce((s, e) => s + e.amount, 0);
  const monthInc = Object.values(incByDay).flat().reduce((s, e) => s + e.amount, 0);
  const fixedTotal = fixed.reduce((s, f) => s + f.amount, 0);
  const dayNames = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

  return (
    <div className="page fade-up">
      <div className="hero-grid">
        <div className="glass stat-card">
          <div>
            <div className="label">{t.income_this_month}</div>
            <div className="value num" style={{ color: 'var(--success)' }}>+{fmt(state.conv(monthInc), { lang })}<span className="cur">{state.cur}</span></div>
          </div>
        </div>
        <div className="glass stat-card">
          <div>
            <div className="label">{t.expenses_this_month}</div>
            <div className="value num">−{fmt(state.conv(monthExp + fixedTotal), { lang })}<span className="cur">{state.cur}</span></div>
          </div>
        </div>
        <div className="glass stat-card">
          <div>
            <div className="label">{t.balance_label}</div>
            <div className="value num">{fmt(state.conv(monthInc - monthExp - fixedTotal), { lang })}<span className="cur">{state.cur}</span></div>
          </div>
        </div>
      </div>

      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.cal_title}</div>
            <div className="panel-sub">{daysInMonth} {lang === 'ro' ? 'zile' : 'days'} · {lang === 'ro' ? 'intensitate cheltuieli' : 'spending intensity'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-mute)' }}>
            <span>{lang === 'ro' ? 'Mai puțin' : 'Less'}</span>
            {[0, 1, 2, 3, 4].map(i => (
              <span key={i} style={{ width: 12, height: 12, borderRadius: 3 }} className={`cal-intensity-${i}`}/>
            ))}
            <span>{lang === 'ro' ? 'Mai mult' : 'More'}</span>
          </div>
        </div>

        <div className="cal-grid">
          {dayNames.map(d => <div key={d} className="cal-headcell">{d}</div>)}
          {cells.map(c => {
            if (c.empty) return <div key={c.key} className="cal-cell empty"/>;
            return (
              <div key={c.key} className={`cal-cell cal-intensity-${intensityOf(c.expSum)} ${c.isToday ? 'today' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="cal-num">{c.day}</span>
                  {c.incSum > 0 && <span style={{ fontSize: 10, color: 'var(--success)' }}>●</span>}
                </div>
                {c.expSum > 0 && <div className="cal-expense">−{fmtShort(c.expSum)}</div>}
                {c.incSum > 0 && <div className="cal-income">+{fmtShort(c.incSum)}</div>}
                {c.expCats.length > 0 && (
                  <div className="cal-dot-row">
                    {c.expCats.slice(0, 4).map(cid => {
                      const cc = catById(cid);
                      return <span key={cid} className="cal-dot" style={{ background: cc.color, boxShadow: `0 0 6px ${cc.glow}` }}/>;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
