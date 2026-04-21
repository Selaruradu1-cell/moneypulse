import { T } from '../utils/data';
import { Segment } from '../components/Primitives';

export default function Settings({ lang, setLang, accent, setAccent }) {
  const t = T[lang];
  return (
    <div className="page fade-up">
      <div className="glass panel">
        <div className="panel-head">
          <div>
            <div className="panel-title">{t.settings_title}</div>
            <div className="panel-sub">{t.settings_sub}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 520 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{lang === 'ro' ? 'Limbă' : 'Language'}</div>
            <Segment value={lang} onChange={setLang} options={[{ value: 'ro', label: 'Română' }, { value: 'en', label: 'English' }]}/>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{lang === 'ro' ? 'Culoare signal' : 'Signal color'}</div>
            <div className="swatch-row">
              {[150, 200, 265, 320, 15, 75].map(h => (
                <div key={h} className={`swatch ${accent === h ? 'active' : ''}`} style={{ background: `oklch(0.78 0.17 ${h})`, color: `oklch(0.78 0.17 ${h})` }} onClick={() => setAccent(h)}/>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{lang === 'ro' ? 'Valută' : 'Currency'}</div>
            <Segment value="RON" onChange={()=>{}} options={[{ value: 'RON', label: 'RON' }, { value: 'EUR', label: 'EUR' }, { value: 'USD', label: 'USD' }]}/>
          </div>
        </div>
      </div>
    </div>
  );
}
