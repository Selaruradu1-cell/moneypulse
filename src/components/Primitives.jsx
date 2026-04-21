import { useState, useEffect } from 'react';
import Icon from './Icon';
import { MONTHS_RO, MONTHS_EN, fmtShort, fmt } from '../utils/data';

// localStorage hook
export function useLocal(key, initial) {
  const [v, setV] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; }
    catch (e) { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch(e){} }, [key, v]);
  return [v, setV];
}

// MonthPill
export function MonthPill({ month, year, onPrev, onNext, lang }) {
  const label = `${(lang === 'ro' ? MONTHS_RO : MONTHS_EN)[month]} ${year}`;
  return (
    <div className="month-pill">
      <button className="arrow" onClick={onPrev}><Icon name="chevronLeft" size={14}/></button>
      <div className="label">{label}</div>
      <button className="arrow" onClick={onNext}><Icon name="chevronRight" size={14}/></button>
    </div>
  );
}

// Segmented control
export function Segment({ value, onChange, options }) {
  return (
    <div className="segment">
      {options.map((o) => (
        <button key={o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

// Delta pill
export function Delta({ value, invert }) {
  if (value === 0 || value === undefined) return null;
  const positive = invert ? value < 0 : value > 0;
  const cls = positive ? 'up' : 'down';
  const arrow = value > 0 ? '↑' : '↓';
  return <span className={`delta ${cls}`}>{arrow} {Math.abs(value).toFixed(1)}%</span>;
}

// Donut chart
export function Donut({ segments, size = 180, total, label }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="oklch(0.98 0 0 / 0.06)" strokeWidth="16"/>
        {segments.map((s, i) => {
          const frac = total > 0 ? s.value / total : 0;
          const len = frac * c;
          const dash = `${Math.max(0, len - 3)} ${c}`;
          const rot = (off / c) * 360 - 90;
          off += len;
          return (
            <circle key={i}
              cx="90" cy="90" r={r} fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={dash}
              strokeLinecap="round"
              transform={`rotate(${rot} 90 90)`}
              style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
            />
          );
        })}
      </svg>
      <div className="hole">
        <div>
          <div className="big num">{fmtShort(total)}</div>
          <div className="small">{label}</div>
        </div>
      </div>
    </div>
  );
}

// Area chart with gradient + glow
export function AreaChart({ points, width = 600, height = 220, lang }) {
  const pad = { l: 36, r: 10, t: 14, b: 26 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const max = Math.max(1, ...points.map(p => p.v));
  const xs = (i) => pad.l + (i / Math.max(1, points.length - 1)) * w;
  const ys = (v) => pad.t + h - (v / max) * h;
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(p.v)}`).join(' ');
  const area = `${path} L ${xs(points.length - 1)} ${pad.t + h} L ${xs(0)} ${pad.t + h} Z`;
  const ticks = 4;
  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const y = pad.t + (h / ticks) * i;
        const val = max * (1 - i / ticks);
        return (
          <g key={i}>
            <line className="grid-line" x1={pad.l} x2={pad.l + w} y1={y} y2={y} />
            <text className="axis-label" x={pad.l - 6} y={y + 3} textAnchor="end">{fmtShort(val)}</text>
          </g>
        );
      })}
      <path className="area" d={area} />
      <path className="line" d={path} />
      {points.map((p, i) => (
        i % Math.ceil(points.length / 8) === 0 ? (
          <g key={i}>
            <text className="axis-label" x={xs(i)} y={height - 8} textAnchor="middle">{p.label}</text>
          </g>
        ) : null
      ))}
      {points.map((p, i) => (
        <circle key={'c' + i} className="point" cx={xs(i)} cy={ys(p.v)} r={i === points.length - 1 ? 4 : 0}/>
      ))}
    </svg>
  );
}

// Sparkline
export function Sparkline({ values, color = 'currentColor', height = 44 }) {
  const w = 140;
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, height - ((v - min) / range) * height]);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaPath = `${d} L ${w} ${height} L 0 ${height} Z`;
  const gid = 'spark-' + Math.random().toString(36).slice(2, 7);
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" style={{ filter: `drop-shadow(0 0 3px ${color})` }}/>
    </svg>
  );
}
