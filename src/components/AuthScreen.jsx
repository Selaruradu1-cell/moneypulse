import { useState } from 'react';
import { supabase } from '../utils/supabase';

const txt = {
  ro: {
    tagline: 'Banii tăi au acum un plan.',
    signup: 'Creează cont nou',
    login: 'Am deja cont',
    name: 'Numele tău',
    namePh: 'ex: Radu Selaru',
    email: 'Email',
    emailPh: 'radu@email.com',
    pass: 'Parolă',
    passPh: 'Min. 6 caractere',
    passPhLogin: 'Parola ta',
    creating: 'Se creează...',
    create: 'Creează cont',
    logging: 'Se conectează...',
    enter: 'Intră în cont',
    hasAccount: 'Am deja cont →',
    noAccount: 'Nu am cont → Creează',
    verify: 'Verifică-ți emailul',
    verifyText: 'Am trimis un link de confirmare la',
    verifyBtn: 'Am confirmat → Intră în cont',
    fillAll: 'Completează toate câmpurile (parola min. 6 caractere)',
  },
  en: {
    tagline: 'Your money just got smarter.',
    signup: 'Create new account',
    login: 'I already have an account',
    name: 'Your name',
    namePh: 'e.g. John Doe',
    email: 'Email',
    emailPh: 'john@email.com',
    pass: 'Password',
    passPh: 'Min. 6 characters',
    passPhLogin: 'Your password',
    creating: 'Creating...',
    create: 'Create account',
    logging: 'Signing in...',
    enter: 'Sign in',
    hasAccount: 'Already have an account →',
    noAccount: 'No account → Create one',
    verify: 'Check your email',
    verifyText: 'We sent a confirmation link to',
    verifyBtn: 'I confirmed → Sign in',
    fillAll: 'Fill in all fields (password min. 6 characters)',
  },
};

export default function AuthScreen({ onAuth }) {
  const [lang, setLang] = useState('ro');
  const [mode, setMode] = useState('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = txt[lang];

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError(t.fillAll);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: 'https://selaruradu1-cell.github.io/moneypulse/',
      },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else if (data.session) {
      onAuth(data.session, name.trim());
    } else if (data.user && !data.session) {
      // If email confirmation is still enabled, show verify screen
      setMode('verify');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      onAuth(data.session);
    }
  };

  return (
    <>
      <div className="stage">
        <div className="orb a"/><div className="orb b"/>
        <div className="orb c"/><div className="orb d"/>
      </div>

      <div className="auth-screen">
        <div className="auth-card glass">
          {/* Language switcher */}
          <div className="lang-switcher" style={{ position: 'absolute', top: 16, right: 16 }}>
            <button className={`lang-flag ${lang === 'ro' ? 'active' : ''}`} onClick={() => setLang('ro')} title="Română">
              <svg viewBox="0 0 30 20" width="22" height="15"><rect x="0" width="10" height="20" fill="#002B7F"/><rect x="10" width="10" height="20" fill="#FCD116"/><rect x="20" width="10" height="20" fill="#CE1126"/></svg>
            </button>
            <button className={`lang-flag ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')} title="English">
              <svg viewBox="0 0 60 30" width="22" height="15"><clipPath id="s"><rect width="60" height="30"/></clipPath><g clipPath="url(#s)"><rect width="60" height="30" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6"/><path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" strokeWidth="4" clipPath="url(#s)"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/></g></svg>
            </button>
          </div>

          <div className="auth-logo">
            <div className="brand-mark" style={{ width: 64, height: 64, fontSize: 32 }}>₽</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', marginTop: 16 }}>MoneyPulse</h1>
            <p style={{ color: 'var(--ink-mute)', fontSize: 14, marginTop: 4 }}>{t.tagline}</p>
          </div>

          {mode === 'welcome' && (
            <div className="auth-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => setMode('signup')}>
                {t.signup}
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setMode('login')}>
                {t.login}
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="field">
                <label>{t.name}</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder={t.namePh} autoFocus/>
              </div>
              <div className="field">
                <label>{t.email}</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh}/>
              </div>
              <div className="field">
                <label>{t.pass}</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPh}/>
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? t.creating : t.create}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setMode('login'); setError(''); }}>
                {t.hasAccount}
              </button>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="field">
                <label>{t.email}</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.emailPh} autoFocus/>
              </div>
              <div className="field">
                <label>{t.pass}</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPhLogin}/>
              </div>
              {error && <div className="auth-error">{error}</div>}
              <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
                {loading ? t.logging : t.enter}
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setMode('signup'); setError(''); }}>
                {t.noAccount}
              </button>
            </form>
          )}

          {mode === 'verify' && (
            <div className="auth-verify">
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h3>{t.verify}</h3>
              <p style={{ color: 'var(--ink-dim)', fontSize: 14, lineHeight: 1.6, marginTop: 8 }}>
                {t.verifyText} <strong>{email}</strong>.
              </p>
              <button className="btn btn-ghost btn-lg" onClick={() => { setMode('login'); setError(''); }} style={{ marginTop: 20 }}>
                {t.verifyBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
