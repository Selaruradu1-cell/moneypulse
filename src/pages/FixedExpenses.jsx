import { useState } from 'react';
import { T, fmt } from '../utils/data';
import Icon from '../components/Icon';

function AddFixedModal({ onClose, onAdd, lang }) {
  const t = T[lang];
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('1');
  const [icon, setIcon] = useState('🏠');

  const icons = ['🏠', '⚡', '📱', '🌐', '💧', '🔥', '🏋️', '🎵', '📺', '🚗', '🛡️', '💳'];

  const submit = () => {
    if (!name.trim() || !amount) return;
    onAdd({
      id: 'fix-' + Date.now(),
      nameRo: name, nameEn: name,
      amount: parseFloat(amount),
      dueDay: parseInt(dueDay),
      icon,
    });
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="glass modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h3>{lang === 'ro' ? 'Adaugă cheltuială fixă' : 'Add fixed expense'}</h3>
            <p className="sub">{lang === 'ro' ? 'Plată recurentă lunară' : 'Monthly recurring payment'}</p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>{lang === 'ro' ? 'Denumire' : 'Name'}</label>
            <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ro' ? 'ex: Chirie apartament' : 'e.g. Rent'}/>
          </div>
          <div className="field">
            <label>{t.amount} (RON)</label>
            <input className="input num" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"/>
          </div>
          <div className="field">
            <label>{lang === 'ro' ? 'Ziua scadentă' : 'Due day'}</label>
            <input className="input num" type="number" min="1" max="31" value={dueDay} onChange={(e) => setDueDay(e.target.value)} placeholder="1"/>
          </div>
          <div className="field full">
            <label>{lang === 'ro' ? 'Iconiță' : 'Icon'}</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {icons.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)} style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 18,
                  background: icon === ic ? 'var(--accent-soft)' : 'oklch(0.98 0 0 / 0.06)',
                  boxShadow: icon === ic ? '0 0 12px var(--accent-glow)' : 'none',
                }}>{ic}</button>
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

export default function FixedExpenses({ state, setState, lang }) {
  const t = T[lang];
  const fixed = state.fixedExpenses || [];
  const total = fixed.reduce((s, f) => s + f.amount, 0);
  const [showAdd, setShowAdd] = useState(false);

  const add = (item) => setState({ fixedExpenses: [...fixed, item] });

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
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={14}/>{lang === 'ro' ? 'Adaugă' : 'Add'}</button>
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
      {showAdd && <AddFixedModal onClose={() => setShowAdd(false)} onAdd={add} lang={lang}/>}
    </div>
  );
}
