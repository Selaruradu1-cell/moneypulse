import { useState, useRef } from 'react';
import { T, CATEGORIES, fmt, catById } from '../utils/data';
import Icon from '../components/Icon';
import { createWorker } from 'tesseract.js';

function AddExpenseModal({ onClose, onAdd, lang, prefill }) {
  const t = T[lang];
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState(prefill?.name || '');
  const [amount, setAmount] = useState(prefill?.amount || '');
  const [cat, setCat] = useState(prefill?.category || 'food');
  const [date, setDate] = useState(prefill?.date || today);

  const submit = () => {
    if (!name.trim() || !amount) return;
    onAdd({
      id: 'exp-' + Math.random().toString(36).slice(2, 9),
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
            <h3>{t.add_expense_title}</h3>
            <p className="sub">{t.add_expense_sub}</p>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>{t.what}</label>
            <input className="input" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'ro' ? 'ex: Prânz Mahala' : 'e.g. Lunch at Mahala'}/>
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
              {CATEGORIES.map((c) => (
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

function parseReceipt(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract store name — usually first non-empty meaningful line
  let storeName = '';
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-ZăâîșțĂÂÎȘȚ\s&\-\.]/g, '').trim();
    if (clean.length >= 3 && !/^\d/.test(line) && !/^(str|nr|tel|cui|cod|cf|reg|jud)/i.test(clean)) {
      storeName = clean;
      break;
    }
  }

  // Extract total — look for TOTAL keyword followed by a number
  let total = null;
  const totalPatterns = [
    /total\s*[:=]?\s*([\d.,]+)/i,
    /total\s+lei\s*[:=]?\s*([\d.,]+)/i,
    /total\s+([\d.,]+)/i,
    /total\s*plat[aă]\s*[:=]?\s*([\d.,]+)/i,
    /total\s*general\s*[:=]?\s*([\d.,]+)/i,
    /suma\s*[:=]?\s*([\d.,]+)/i,
    /de\s*plat[aă]\s*[:=]?\s*([\d.,]+)/i,
  ];

  for (const line of lines) {
    for (const pat of totalPatterns) {
      const m = line.match(pat);
      if (m) {
        const val = m[1].replace(',', '.');
        const num = parseFloat(val);
        if (num > 0 && num < 100000) {
          total = num;
          break;
        }
      }
    }
    if (total) break;
  }

  // Fallback: find the largest number that looks like a price
  if (!total) {
    let maxNum = 0;
    for (const line of lines) {
      const matches = line.match(/(\d+[.,]\d{2})/g);
      if (matches) {
        for (const m of matches) {
          const n = parseFloat(m.replace(',', '.'));
          if (n > maxNum && n < 100000) maxNum = n;
        }
      }
    }
    if (maxNum > 0) total = maxNum;
  }

  // Try to guess category from store name
  let category = 'other';
  const lower = (storeName + ' ' + text).toLowerCase();
  if (/mega|carrefour|lidl|kaufland|auchan|penny|profi|cora|supermarket|piata|market/i.test(lower)) category = 'food';
  else if (/cafe|coffee|starbucks|ted|origo|beans|cafea/i.test(lower)) category = 'coffee';
  else if (/farmacie|sensiblu|catena|pharmacy|dona/i.test(lower)) category = 'health';
  else if (/omv|mol|petrom|benzin|rompetrol|lukoil|bolt|uber|taxi/i.test(lower)) category = 'transport';
  else if (/zara|h&m|emag|altex|decathlon|ikea|jysk/i.test(lower)) category = 'shopping';
  else if (/cinema|netflix|spotify|restaurant|bar|pub/i.test(lower)) category = 'fun';

  return {
    name: storeName || '',
    amount: total ? String(total) : '',
    category,
  };
}

export default function DailyExpenses({ state, setState, lang }) {
  const t = T[lang];
  const { expenses, month, year } = state;
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [prefill, setPrefill] = useState(null);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef(null);

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year;
  });

  const filtered = monthExpenses.filter(e => {
    if (filter !== 'all' && e.category !== filter) return false;
    if (query && !(e[`name${lang === 'ro' ? 'Ro' : 'En'}`] || '').toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const byDate = {};
  filtered.sort((a, b) => b.date.localeCompare(a.date)).forEach(e => {
    (byDate[e.date] = byDate[e.date] || []).push(e);
  });

  const avgDay = new Set(monthExpenses.map(e => e.date)).size;
  const avg = avgDay ? monthExpenses.reduce((s, e) => s + e.amount, 0) / avgDay : 0;
  const largest = monthExpenses.reduce((m, e) => e.amount > (m?.amount || 0) ? e : m, null);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySum = expenses.filter(e => e.date === todayStr).reduce((s, e) => s + e.amount, 0);

  const fmtDay = (iso) => {
    const d = new Date(iso);
    const t2 = new Date().toISOString().slice(0, 10);
    const y = new Date(); y.setDate(y.getDate() - 1);
    const ys = y.toISOString().slice(0, 10);
    if (iso === t2) return t.today;
    if (iso === ys) return t.yesterday;
    return d.toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const del = (id) => setState({ expenses: expenses.filter(e => e.id !== id) });
  const add = (newExp) => setState({ expenses: [...expenses, newExp] });

  const handleScan = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    try {
      const worker = await createWorker('ron');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();
      const result = parseReceipt(text);
      setPrefill(result);
      setShowAdd(true);
    } catch (err) {
      console.error('OCR error:', err);
      setPrefill(null);
      setShowAdd(true);
    }
    setScanning(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const catCounts = {};
  monthExpenses.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });

  return (
    <div className="page fade-up">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleScan}/>

      <div className="hero-grid">
        <div className="glass stat-card">
          <div>
            <div className="label">{t.today_spend}</div>
            <div className="value num">{fmt(state.conv(todaySum), { lang })}<span className="cur">{state.cur}</span></div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{new Date().toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
        <div className="glass stat-card">
          <div>
            <div className="label">{t.avg_per_day}</div>
            <div className="value num">{fmt(state.conv(avg), { lang })}<span className="cur">{state.cur}</span></div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{avgDay} {lang === 'ro' ? 'zile active' : 'active days'}</div>
        </div>
        <div className="glass stat-card">
          <div>
            <div className="label">{t.largest}</div>
            <div className="value num">{largest ? fmt(state.conv(largest.amount), { lang }) : '—'}<span className="cur">{state.cur}</span></div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>{largest ? largest[`name${lang === 'ro' ? 'Ro' : 'En'}`] : '—'}</div>
        </div>
      </div>

      <div className="glass panel">
        <div className="panel-head" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div className="search-pill" style={{ flex: 1, minWidth: 0 }}>
              <Icon name="search" size={14}/>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search_expenses}/>
            </div>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()} disabled={scanning}>
              <Icon name="camera" size={14}/>
              {scanning ? (lang === 'ro' ? 'Se scanează...' : 'Scanning...') : t.scan_receipt}
            </button>
            <button className="btn btn-primary" onClick={() => { setPrefill(null); setShowAdd(true); }}><Icon name="plus" size={14}/>{t.add_expense}</button>
          </div>
        </div>

        <div className="chip-row" style={{ marginBottom: 18 }}>
          <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            {t.filter_all} <span style={{ color: 'var(--ink-mute)' }}>{monthExpenses.length}</span>
          </button>
          {CATEGORIES.filter(c => catCounts[c.id]).map((c) => (
            <button key={c.id} className={`chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, boxShadow: `0 0 8px ${c.glow}` }}></span>
              {c[lang]} <span style={{ color: 'var(--ink-mute)' }}>{catCounts[c.id]}</span>
            </button>
          ))}
        </div>

        {Object.keys(byDate).length === 0 && (
          <div className="empty">
            <div className="icon">🛒</div>
            <div>{lang === 'ro' ? 'Nicio cheltuială găsită' : 'No expenses found'}</div>
          </div>
        )}

        {Object.entries(byDate).map(([date, items]) => {
          const daySum = items.reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date}>
              <div className="day-divider">
                <span>{fmtDay(date)}</span>
                <span className="day-total">−{fmt(state.conv(daySum), { lang })} {state.cur}</span>
              </div>
              {items.map(e => {
                const c = catById(e.category);
                return (
                  <div className="row" key={e.id}>
                    <div className="cat-icon" style={{ background: c.color, '--icon-glow': c.glow }}>{c.icon}</div>
                    <div>
                      <div className="row-name">{e[`name${lang === 'ro' ? 'Ro' : 'En'}`]}</div>
                      <div className="row-meta">{c[lang]}</div>
                    </div>
                    <div className="row-amt neg num">−{fmt(state.conv(e.amount), { lang })}</div>
                    <button className="row-action" onClick={() => del(e.id)} title="delete"><Icon name="trash" size={13}/></button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {showAdd && <AddExpenseModal onClose={() => { setShowAdd(false); setPrefill(null); }} onAdd={add} lang={lang} prefill={prefill}/>}
    </div>
  );
}
