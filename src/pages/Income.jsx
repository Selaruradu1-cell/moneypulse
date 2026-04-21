import { useState } from 'react';
import { T, INCOME_CATS, fmt, incomeCatById } from '../utils/data';
import Icon from '../components/Icon';
import { Delta } from '../components/Primitives';

function AddIncomeModal({ onClose, onAdd, lang }) {
  const t = T[lang];
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('salary');
  const [date, setDate] = useState(today);

  const submit = () => {
    if (!name.trim() || !amount) return;
    onAdd({
      id: 'inc-' + Math.random().toString(36).slice(2, 9),
      nameRo: name, nameEn: name,
      amount: parseFloat(amount),
      category: cat, date,
    });
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="glass modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h3>{t.add_income}</h3>
            <p className="sub">{t.income_sub}</p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>{lang === 'ro' ? 'Denumire' : 'Description'}</label>
            <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ro' ? 'ex: Salariu Aprilie' : 'e.g. April salary'}/>
          </div>
          <div className="field">
            <label>{t.amount} (RON)</label>
            <input className="input num" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"/>
          </div>
          <div className="field">
            <label>{t.date}</label>
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
          </div>
          <div className="field full">
            <label>{t.category}</label>
            <div className="cat-picker">
              {INCOME_CATS.map((c) => (
                <button key={c.id} className={`cat-opt ${cat === c.id ? 'active' : ''}`} onClick={() => setCat(c.id)}>
                  <span className="cat-mini" style={{ background: c.color }}></span>
                  <span>{c[lang]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
          <button className="btn btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={submit}><Icon name="check" size={14}/>{t.save}</button>
        </div>
      </div>
    </div>
  );
}

export default function Income({ state, setState, lang }) {
  const t = T[lang];
  const { incomes, month, year } = state;
  const [showAdd, setShowAdd] = useState(false);

  const monthly = incomes.filter(e => {
    const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year;
  });
  const total = monthly.reduce((s, e) => s + e.amount, 0);

  // Previous month for comparison
  const prevM = month === 0 ? 11 : month - 1;
  const prevY = month === 0 ? year - 1 : year;
  const prevMonthly = incomes.filter(e => {
    const d = new Date(e.date); return d.getMonth() === prevM && d.getFullYear() === prevY;
  });
  const prevTotal = prevMonthly.reduce((s, e) => s + e.amount, 0);
  const hasPrev = prevMonthly.length > 0;
  const deltaPercent = hasPrev && prevTotal !== 0
    ? ((total - prevTotal) / Math.abs(prevTotal)) * 100
    : null;

  const byCat = {};
  monthly.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.amount; });

  const del = (id) => setState({ incomes: incomes.filter(e => e.id !== id) });
  const add = (newInc) => setState({ incomes: [...incomes, newInc] });

  return (
    <div className="page fade-up">
      <div className="hero-grid">
        <div className="glass hero-card primary">
          <div>
            <div className="eyebrow">{t.income_this_month}</div>
            <div className="amount num" style={{
              background: 'linear-gradient(180deg, #fff 30%, oklch(0.82 0.17 155))',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>+{fmt(state.conv(total), { lang })}<span className="cur">{state.cur}</span></div>
            {deltaPercent !== null && <Delta value={parseFloat(deltaPercent.toFixed(1))}/>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{monthly.length} {lang === 'ro' ? 'intrări' : 'entries'}</div>
        </div>
        {INCOME_CATS.slice(0, 2).map(c => (
          <div className="glass stat-card" key={c.id}>
            <div>
              <div className="label">{c[lang]}</div>
              <div className="value num">{fmt(state.conv(byCat[c.id] || 0), { lang })}<span className="cur">{state.cur}</span></div>
            </div>
            <div style={{ fontSize: 24, opacity: 0.7 }}>{c.icon}</div>
          </div>
        ))}
      </div>

      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.income_title}</div>
            <div className="panel-sub">{t.income_sub}</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={14}/>{t.add_income}</button>
        </div>
        {monthly.length === 0 ? (
          <div className="empty"><div className="icon">💰</div><div>{lang === 'ro' ? 'Niciun venit luna asta' : 'No income this month'}</div></div>
        ) : [...monthly].sort((a,b)=>b.date.localeCompare(a.date)).map(e => {
          const c = incomeCatById(e.category);
          return (
            <div className="row" key={e.id}>
              <div className="cat-icon" style={{ background: c.color, '--icon-glow': c.color + '88' }}>{c.icon}</div>
              <div>
                <div className="row-name">{e[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                <div className="row-meta">{c[lang]} · {new Date(e.date).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: '2-digit', month: 'short' })}</div>
              </div>
              <div className="row-amt pos num">+{fmt(state.conv(e.amount), { lang })}</div>
              <button className="row-action" onClick={() => del(e.id)}><Icon name="trash" size={13}/></button>
            </div>
          );
        })}
      </div>

      {showAdd && <AddIncomeModal onClose={() => setShowAdd(false)} onAdd={add} lang={lang}/>}
    </div>
  );
}
