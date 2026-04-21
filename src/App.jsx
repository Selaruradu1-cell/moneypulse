import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { T } from './utils/data';
import { supabase, saveUserData, loadUserData } from './utils/supabase';
import { useLocal, MonthPill } from './components/Primitives';
import Icon from './components/Icon';
import Sidebar from './components/Sidebar';
import AuthScreen from './components/AuthScreen';
import Dashboard from './pages/Dashboard';
import FixedExpenses from './pages/FixedExpenses';
import DailyExpenses from './pages/DailyExpenses';
import Income from './pages/Income';
import Analysis from './pages/Analysis';
import Health from './pages/Health';
import CalendarPage from './pages/Calendar';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Loans from './pages/Loans';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <div className="stage">
          <div className="orb a"/><div className="orb b"/>
          <div className="orb c"/><div className="orb d"/>
        </div>
        <div className="auth-screen">
          <div className="auth-card glass">
            <div className="auth-logo">
              <div className="brand-mark" style={{ width: 64, height: 64, fontSize: 32 }}>₽</div>
              <p style={{ color: 'var(--ink-mute)', marginTop: 16 }}>Se încarcă...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return <AuthScreen onAuth={(s) => setSession(s)} />;
  }

  return <MainApp session={session} onLogout={() => supabase.auth.signOut()} />;
}

function useEurRate() {
  const [rate, setRate] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem('mp.eurRate'));
      if (cached && cached.date === new Date().toISOString().slice(0, 10)) return cached.rate;
    } catch {}
    return null;
  });

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const cached = JSON.parse(localStorage.getItem('mp.eurRate'));
      if (cached && cached.date === today) { setRate(cached.rate); return; }
    } catch {}

    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(r => r.json())
      .then(data => {
        const ronRate = data.rates?.RON;
        if (ronRate) {
          setRate(ronRate);
          localStorage.setItem('mp.eurRate', JSON.stringify({ rate: ronRate, date: today }));
        }
      })
      .catch(() => {});
  }, []);

  return rate;
}

function MainApp({ session, onLogout }) {
  const [lang, setLang] = useLocal('mp.lang', 'ro');
  const [accent, setAccent] = useLocal('mp.accent', 150);
  const [page, setPage] = useLocal('mp.page', 'dashboard');
  const [currency, setCurrency] = useLocal('mp.currency', 'RON');
  const eurRate = useEurRate();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const [userName, setUserName] = useState(session.user.user_metadata?.name || 'User');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loans, setLoans] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    async function load() {
      const result = await loadUserData(session.user.id);
      if (result) {
        if (result.name) setUserName(result.name);
        const d = result.data || {};
        if (d.expenses) setExpenses(d.expenses);
        if (d.incomes) setIncomes(d.incomes);
        if (d.fixedExpenses) setFixedExpenses(d.fixedExpenses);
        if (d.goals) setGoals(d.goals);
        if (d.loans) setLoans(d.loans);
      }
      setDataLoaded(true);
    }
    load();
  }, [session.user.id]);

  // Save to Supabase whenever data changes (debounced)
  const saveTimer = useRef(null);
  const save = useCallback(() => {
    if (!dataLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveUserData(session.user.id, userName, {
        expenses, incomes, fixedExpenses, goals, loans,
      });
    }, 1000);
  }, [session.user.id, userName, expenses, incomes, fixedExpenses, goals, loans, dataLoaded]);

  useEffect(() => { save(); }, [save]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-h', accent);
  }, [accent]);

  const conv = (amount) => currency === 'EUR' && eurRate ? amount / eurRate : amount;
  const cur = currency === 'EUR' ? 'EUR' : 'RON';
  const state = { expenses, incomes, fixedExpenses, goals, loans, month, year, conv, cur };
  const setState = (partial) => {
    if (partial.expenses !== undefined) setExpenses(partial.expenses);
    if (partial.incomes !== undefined) setIncomes(partial.incomes);
    if (partial.fixedExpenses !== undefined) setFixedExpenses(partial.fixedExpenses);
    if (partial.goals !== undefined) setGoals(partial.goals);
    if (partial.loans !== undefined) setLoans(partial.loans);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };

  const t = T[lang];
  const pageTitle = {
    dashboard: { crumb: 'Overview', title: (lang === 'ro' ? 'Bună dimineața, ' : 'Good morning, ') + userName.split(' ')[0] },
    calendar:  { crumb: t.nav.calendar,  title: t.cal_sub || t.cal_title },
    income:    { crumb: t.nav.income,    title: t.income_sub || t.income_title },
    fixed:     { crumb: t.nav.fixed,     title: t.fixed_sub || t.fixed_title },
    daily:     { crumb: t.nav.daily,     title: t.daily_sub || t.daily_title },
    goals:     { crumb: t.nav.goals,     title: t.goals_sub || t.goals_title },
    loans:     { crumb: t.nav.loans,     title: t.loans_sub || t.loans_title },
    analysis:  { crumb: t.nav.analysis,  title: t.analysis_sub || t.analysis_title },
    reports:   { crumb: t.nav.reports,   title: t.reports_sub || t.reports_title },
    health:    { crumb: t.nav.health,    title: t.health_page_sub || t.health_title },
    settings:  { crumb: t.nav.settings,  title: t.settings_sub || t.settings_title },
  }[page];

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard state={state} lang={lang} setPage={setPage} userName={userName}/>;
      case 'calendar':  return <CalendarPage state={state} lang={lang} setPage={setPage}/>;
      case 'income':    return <Income state={state} setState={setState} lang={lang}/>;
      case 'fixed':     return <FixedExpenses state={state} setState={setState} lang={lang}/>;
      case 'daily':     return <DailyExpenses state={state} setState={setState} lang={lang}/>;
      case 'goals':     return <Goals state={state} setState={setState} lang={lang}/>;
      case 'loans':     return <Loans state={state} setState={setState} lang={lang}/>;
      case 'analysis':  return <Analysis state={state} lang={lang}/>;
      case 'reports':   return <Reports state={state} lang={lang}/>;
      case 'health':    return <Health state={state} lang={lang}/>;
      case 'settings':  return <Settings lang={lang} setLang={setLang} accent={accent} setAccent={setAccent} currency={currency} setCurrency={setCurrency}/>;
      default: return null;
    }
  };

  if (!dataLoaded) {
    return (
      <>
        <div className="stage">
          <div className="orb a"/><div className="orb b"/>
          <div className="orb c"/><div className="orb d"/>
        </div>
        <div className="auth-screen">
          <div className="auth-card glass">
            <div className="auth-logo">
              <div className="brand-mark" style={{ width: 64, height: 64, fontSize: 32 }}>₽</div>
              <p style={{ color: 'var(--ink-mute)', marginTop: 16 }}>Se încarcă datele...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="stage">
        <div className="orb a"/>
        <div className="orb b"/>
        <div className="orb c"/>
        <div className="orb d"/>
      </div>

      <div className="app">
        <Sidebar page={page} setPage={setPage} lang={lang} userName={userName} setUserName={setUserName} onLogout={onLogout}/>

        <div className="glass shell-main">
          <div className="topbar">
            <div className="topbar-left">
              <div>
                <div className="page-crumb">{pageTitle.crumb}</div>
                <div className="page-title">{pageTitle.title}</div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="search-pill">
                <Icon name="search" size={14}/>
                <input placeholder={t.search}/>
                <span className="kbd">⌘K</span>
              </div>
              {eurRate && (
                <div className="eur-rate-pill">
                  <span className="eur-rate-label">1 EUR = {eurRate.toFixed(4)} RON</span>
                  <button
                    className={`cur-toggle ${currency === 'RON' ? 'active' : ''}`}
                    onClick={() => setCurrency('RON')}
                  >RON</button>
                  <button
                    className={`cur-toggle ${currency === 'EUR' ? 'active' : ''}`}
                    onClick={() => setCurrency('EUR')}
                  >EUR</button>
                </div>
              )}
              <MonthPill month={month} year={year} onPrev={prevMonth} onNext={nextMonth} lang={lang}/>
              <div className="lang-switcher">
                <button className={`lang-flag ${lang === 'ro' ? 'active' : ''}`} onClick={() => setLang('ro')} title="Română">
                  <svg viewBox="0 0 30 20" width="22" height="15"><rect x="0" width="10" height="20" fill="#002B7F"/><rect x="10" width="10" height="20" fill="#FCD116"/><rect x="20" width="10" height="20" fill="#CE1126"/></svg>
                </button>
                <button className={`lang-flag ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')} title="English">
                  <svg viewBox="0 0 60 30" width="22" height="15"><clipPath id="s"><rect width="60" height="30"/></clipPath><g clipPath="url(#s)"><rect width="60" height="30" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#s)"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/></g></svg>
                </button>
              </div>
              <button className="btn btn-ghost btn-icon" aria-label="notifications"><Icon name="bell" size={15}/></button>
            </div>
          </div>
          <div className="scroll">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
