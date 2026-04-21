import { useState } from 'react';
import { T, fmt } from '../utils/data';
import Icon from '../components/Icon';
import { Segment } from '../components/Primitives';

export default function Loans({ state, setState, lang }) {
  const t = T[lang];
  const loans = state.loans || [];
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('active');

  const [person, setPerson] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  const activeLoans = loans.filter(l => !l.paid);
  const paidLoans = loans.filter(l => l.paid);
  const totalOut = activeLoans.reduce((s, l) => s + l.amount, 0);
  const displayed = filter === 'active' ? activeLoans : paidLoans;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!person.trim() || !amount) return;
    const loan = {
      id: `loan-${Date.now()}`,
      person: person.trim(),
      amount: parseFloat(amount),
      date,
      note: note.trim(),
      paid: false,
      paidDate: null,
    };
    setState({ loans: [...loans, loan] });
    setPerson('');
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setNote('');
    setShowAdd(false);
  };

  const togglePaid = (id) => {
    setState({
      loans: loans.map(l =>
        l.id === id
          ? { ...l, paid: !l.paid, paidDate: !l.paid ? new Date().toISOString().slice(0, 10) : null }
          : l
      ),
    });
  };

  const deleteLoan = (id) => {
    setState({ loans: loans.filter(l => l.id !== id) });
  };

  return (
    <div className="page fade-up">
      <div className="hero-grid">
        <div className="glass hero-card primary">
          <div>
            <div className="eyebrow">{t.loan_total_out}</div>
            <div className="amount num">
              {fmt(state.conv(totalOut), { lang })}<span className="cur">{state.cur}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>{t.loan_active}</div>
              <div style={{ fontSize: 18, fontWeight: 500 }} className="num">{activeLoans.length}</div>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>{t.loan_history}</div>
              <div style={{ fontSize: 18, fontWeight: 500 }} className="num">{paidLoans.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass panel">
        <div className="panel-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="panel-title">{t.loans_title}</div>
            <Segment
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'active', label: t.loan_active },
                { value: 'history', label: t.loan_history },
              ]}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
            <Icon name="plus" size={14} />
            {t.add_loan}
          </button>
        </div>

        {displayed.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-mute)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
            <div style={{ fontSize: 14 }}>{filter === 'active' ? t.loan_no_loans : (lang === 'ro' ? 'Niciun împrumut returnat încă' : 'No returned loans yet')}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>{filter === 'active' ? t.loan_no_loans_sub : ''}</div>
          </div>
        )}

        {displayed.map((l) => (
          <div className="row" key={l.id} style={{ alignItems: 'center' }}>
            <div className="cat-icon" style={{
              background: l.paid ? 'oklch(0.76 0.15 170 / 0.2)' : 'oklch(0.78 0.17 15 / 0.2)',
              color: l.paid ? 'oklch(0.76 0.15 170)' : 'oklch(0.78 0.17 15)',
              fontSize: 16,
            }}>
              {l.paid ? '✓' : '💸'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row-name">{l.person}</div>
              <div className="row-meta">
                {new Date(l.date).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                {l.note ? ` · ${l.note}` : ''}
                {l.paid && l.paidDate ? ` · ${lang === 'ro' ? 'Returnat' : 'Returned'} ${new Date(l.paidDate).toLocaleDateString(lang === 'ro' ? 'ro-RO' : 'en-GB', { day: '2-digit', month: 'short' })}` : ''}
              </div>
            </div>
            <div className={`row-amt num ${l.paid ? '' : 'neg'}`} style={{ marginRight: 8 }}>
              {l.paid ? '' : '−'}{fmt(state.conv(l.amount), { lang })}
            </div>
            <button
              className={`btn btn-ghost btn-sm`}
              onClick={() => togglePaid(l.id)}
              title={l.paid ? t.loan_mark_unpaid : t.loan_mark_paid}
              style={{ fontSize: 11, whiteSpace: 'nowrap' }}
            >
              {l.paid ? t.loan_mark_unpaid : t.loan_mark_paid}
            </button>
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteLoan(l.id)} style={{ marginLeft: 4 }}>
              <Icon name="trash" size={14} />
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="glass modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{t.add_loan}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAdd(false)}>
                <Icon name="x" size={16} />
              </button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="field">
                <label>{t.loan_to}</label>
                <input
                  className="input"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  placeholder={lang === 'ro' ? 'ex: Mihai Popescu' : 'e.g. John Doe'}
                  autoFocus
                />
              </div>
              <div className="field">
                <label>{t.loan_amount}</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="field">
                <label>{t.loan_date}</label>
                <input
                  className="input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="field">
                <label>{t.loan_note}</label>
                <input
                  className="input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={lang === 'ro' ? 'ex: pentru reparația mașinii' : 'e.g. for car repair'}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1 }}>
                  {t.cancel}
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
