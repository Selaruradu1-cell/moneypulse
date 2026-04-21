import { useState } from 'react';
import { T, fmt } from '../utils/data';
import Icon from '../components/Icon';

function AddGoalModal({ onClose, onAdd, lang }) {
  const t = T[lang];
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('0');
  const [deadline, setDeadline] = useState('');

  const submit = () => {
    if (!name.trim() || !target || !deadline) return;
    onAdd({
      id: 'goal-' + Date.now(),
      nameRo: name, nameEn: name,
      target: parseFloat(target),
      saved: parseFloat(saved) || 0,
      deadline,
    });
    onClose();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="glass modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h3>{lang === 'ro' ? 'Obiectiv nou' : 'New goal'}</h3>
            <p className="sub">{lang === 'ro' ? 'Setează un obiectiv de economisire' : 'Set a savings goal'}</p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>{lang === 'ro' ? 'Denumire' : 'Name'}</label>
            <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ro' ? 'ex: Vacanță Grecia' : 'e.g. Greece vacation'}/>
          </div>
          <div className="field">
            <label>{lang === 'ro' ? 'Sumă țintă' : 'Target amount'} (RON)</label>
            <input className="input num" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0"/>
          </div>
          <div className="field">
            <label>{lang === 'ro' ? 'Economisit deja' : 'Already saved'} (RON)</label>
            <input className="input num" type="number" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="0"/>
          </div>
          <div className="field full">
            <label>{lang === 'ro' ? 'Termen limită' : 'Deadline'}</label>
            <input className="input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
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

export default function Goals({ state, setState, lang }) {
  const t = T[lang];
  const goals = state.goals || [];
  const [showAdd, setShowAdd] = useState(false);

  const add = (goal) => setState({ goals: [...goals, goal] });
  const del = (id) => setState({ goals: goals.filter(g => g.id !== id) });
  const addSaved = (id, extra) => {
    setState({ goals: goals.map(g => g.id === id ? { ...g, saved: g.saved + extra } : g) });
  };

  return (
    <div className="page fade-up">
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.goals_title}</div>
            <div className="panel-sub">{t.goals_sub}</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={14}/>{lang === 'ro' ? 'Obiectiv nou' : 'New goal'}</button>
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
                  <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => addSaved(g.id, 100)}>+100</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => addSaved(g.id, 500)}>+500</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => addSaved(g.id, 1000)}>+1000</button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => del(g.id)} style={{ marginLeft: 'auto' }}><Icon name="trash" size={13}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showAdd && <AddGoalModal onClose={() => setShowAdd(false)} onAdd={add} lang={lang}/>}
    </div>
  );
}
