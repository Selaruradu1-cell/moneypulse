import { T, MONTHS_RO, MONTHS_EN, fmt, catById } from '../utils/data';
import Icon from '../components/Icon';
import { AreaChart } from '../components/Primitives';

export default function Analysis({ state, lang }) {
  const t = T[lang];
  const { expenses, month, year, conv, cur } = state;
  const monthExp = expenses.filter(e => {
    const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year;
  });
  const byCat = {};
  monthExp.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });
  const sorted = Object.entries(byCat)
    .map(([cid, v]) => ({ ...catById(cid), value: v }))
    .sort((a, b) => b.value - a.value);

  const top5 = [...monthExp].sort((a, b) => b.amount - a.amount).slice(0, 5);

  const trend = [];
  for (let i = 5; i >= 0; i--) {
    let m = month - i, y = year;
    if (m < 0) { m += 12; y -= 1; }
    const sum = expenses.filter(e => {
      const d = new Date(e.date); return d.getMonth() === m && d.getFullYear() === y;
    }).reduce((s, e) => s + e.amount, 0);
    trend.push({ label: (lang === 'ro' ? MONTHS_RO : MONTHS_EN)[m].slice(0, 3), v: sum || (700 + Math.random() * 600) });
  }

  const insights = [
    { type: 'warn', titleRo: 'Cafea & Băuturi peste medie', titleEn: 'Coffee & drinks above avg',
      textRo: `Ai cheltuit ${fmt(conv(byCat.coffee || 0), { lang })} ${cur} pe cafea. Dacă reduci la jumătate, economisești ${fmt(conv((byCat.coffee || 0) / 2), { lang })} ${cur}/lună.`,
      textEn: `Coffee spend is ${fmt(conv(byCat.coffee || 0), { lang })} ${cur}. Cut in half to save ${fmt(conv((byCat.coffee || 0) / 2), { lang })} ${cur}/month.` },
    { type: 'success', titleRo: 'Obiectiv de economii', titleEn: 'Savings target',
      textRo: `Reducând 10% din cheltuielile zilnice, economisești ${fmt(conv(monthExp.reduce((s,e)=>s+e.amount,0) * 0.1), { lang })} ${cur}/lună.`,
      textEn: `Cutting daily spend by 10% saves ${fmt(conv(monthExp.reduce((s,e)=>s+e.amount,0) * 0.1), { lang })} ${cur}/month.` },
    { type: 'info', titleRo: 'Atenție la achiziții mici', titleEn: 'Watch small purchases',
      textRo: `${monthExp.filter(e => e.amount < 30).length} cheltuieli sub 30 RON adunate fac ${fmt(conv(monthExp.filter(e=>e.amount<30).reduce((s,e)=>s+e.amount,0)), { lang })} ${cur}.`,
      textEn: `${monthExp.filter(e => e.amount < 30).length} small charges under 30 RON add up to ${fmt(conv(monthExp.filter(e=>e.amount<30).reduce((s,e)=>s+e.amount,0)), { lang })} ${cur}.` },
  ];

  const insightColor = { warn: 'oklch(0.82 0.15 75)', success: 'var(--success)', info: 'var(--info)' };

  return (
    <div className="page fade-up">
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.insights_title}</div>
            <div className="panel-sub">{t.analysis_sub}</div>
          </div>
          <Icon name="sparkles" size={18}/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {insights.map((ins, i) => (
            <div key={i} className="glass-soft" style={{ padding: 16, borderLeft: `2px solid ${insightColor[ins.type]}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: insightColor[ins.type] }}>{ins[`title${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-dim)', lineHeight: 1.5 }}>{ins[`text${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="two-col">
        <div className="glass panel">
          <div className="panel-head">
            <div className="panel-title">{lang === 'ro' ? 'Trend 6 luni' : '6-month trend'}</div>
          </div>
          <AreaChart points={trend} lang={lang}/>
        </div>
        <div className="glass panel">
          <div className="panel-head">
            <div className="panel-title">{t.top_spenders}</div>
          </div>
          {top5.map((e, i) => {
            const c = catById(e.category);
            return (
              <div className="row" key={e.id}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: 'oklch(0.98 0 0 / 0.06)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ink-mute)' }}>{i + 1}</div>
                <div>
                  <div className="row-name">{e[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                  <div className="row-meta"><span style={{ color: c.color }}>●</span> {c[lang]}</div>
                </div>
                <div className="row-amt num">{fmt(conv(e.amount), { lang })}</div>
                <div style={{ width: 28 }}/>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass panel">
        <div className="panel-head">
          <div className="panel-title">{lang === 'ro' ? 'Distribuție pe categorii' : 'Category distribution'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(s => {
            const pct = s.value / sorted[0].value * 100;
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 80px', gap: 14, alignItems: 'center' }}>
                <div style={{ fontSize: 13, color: 'var(--ink-dim)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, boxShadow: `0 0 10px ${s.glow}` }}/>
                  {s[lang]}
                </div>
                <div style={{ height: 10, borderRadius: 999, background: 'oklch(0.98 0 0 / 0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: s.color, boxShadow: `0 0 12px ${s.glow}`, borderRadius: 999 }}/>
                </div>
                <div className="num" style={{ fontSize: 12.5, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(conv(s.value), { lang })}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
