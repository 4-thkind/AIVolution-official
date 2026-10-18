import React from 'react';
import { Link } from 'react-router-dom';

// Tiny presentational scraps used across the notebook homepage.
// Styles live in src/styles/notebook.css.

// The society's WhatsApp channel (same link as the NavBar "Connect" button).
export const WHATSAPP = 'https://whatsapp.com/channel/0029Vb9S7lj8F2pN7ghfV00Q';

// Repo breadcrumb: `aivolutions / README.md`. With `bare`, just the children.
export const SectionLabel = ({ path, bare = false, children, className = '' }) => (
  <p className={`nb-label ${className}`}>
    {!bare && <><span>aivolutions</span><span className="opacity-50">/</span></>}
    {path && <span className="font-bold text-ink">{path}</span>}
    {children && <span className="opacity-70">{children}</span>}
  </p>
);

// Deterministic 7-char "commit hash" from any string (decoration, stable across renders).
export const shortHash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  return h.toString(16).padStart(8, '0').slice(0, 7);
};

// Horizontal tear-off perforation between notebook pages.
export const Perforation = ({ className = '' }) => (
  <div className={`perforation absolute left-0 right-0 bottom-0 z-[2] ${className}`} aria-hidden="true" />
);

export const Mark = ({ children, color, on = false, className = '' }) => (
  <span className={`mark ${on ? 'is-on' : ''} ${className}`} style={color ? { '--mark': color } : undefined}>
    {children}
  </span>
);

export const Hand = ({ children, className = '', rotate = 0, color, style }) => (
  <span
    className={`font-hand inline-block ${className}`}
    style={{ transform: `rotate(${rotate}deg)`, color, ...style }}
  >
    {children}
  </span>
);

export const Tape = ({ children, rotate = -2, tone = '', stripe = false, className = '', style }) => (
  <span
    className={`tape ${stripe ? 'tape--stripe' : ''} ${tone ? `tape--${tone}` : ''} ${className}`}
    style={{ '--r': `${rotate}deg`, ...style }}
  >
    {children}
  </span>
);

export const PostIt = ({ children, rotate = -2, tone = '', className = '', style }) => (
  <div className={`postit ${tone ? `postit--${tone}` : ''} ${className}`} style={{ '--r': `${rotate}deg`, ...style }}>
    {children}
  </div>
);

export const Polaroid = React.forwardRef(
  ({ src, alt = '', caption, sub, rotate = 0, className = '', style, children, ...rest }, ref) => (
    <div ref={ref} className={`polaroid ${className}`} style={{ '--r': `${rotate}deg`, ...style }} {...rest}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      {caption && <p className="polaroid__caption">{caption}</p>}
      {sub && <p className="font-mono text-[0.65rem] tracking-widest uppercase text-pencil mt-1">{sub}</p>}
      {children}
    </div>
  )
);

export const Stamp = ({ children, rotate = -8, color, className = '', style }) => (
  <span className={`stamp ${className}`} style={{ '--r': `${rotate}deg`, '--stamp': color, ...style }}>
    {children}
  </span>
);

export const Sticker = React.forwardRef(({ children, bg = '#fff', fg, className = '', style, ...rest }, ref) => (
  <span ref={ref} className={`sticker diecut ${className}`} style={{ '--bg': bg, '--fg': fg, ...style }} {...rest}>
    {children}
  </span>
));

export const StickerButton = ({ to, href, children, bg, fg, rotate = 0, className = '', ...rest }) => {
  const style = { '--bg': bg, '--fg': fg, '--r': `${rotate}deg` };
  const cls = `btn-sticker ${className}`;
  if (to) return <Link to={to} className={cls} style={style} {...rest}>{children}</Link>;
  return <a href={href} className={cls} style={style} {...rest}>{children}</a>;
};

// Hand-drawn arrow. `flip` mirrors it horizontally.
export const Scribble = ({ className = '', color = 'var(--redpen)', flip = false, style }) => (
  <svg
    viewBox="0 0 120 60"
    className={className}
    style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
    fill="none"
    stroke={color}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 44 C 30 10, 60 6, 108 22" />
    <path d="M96 10 L 110 23 L 94 30" />
  </svg>
);

// (Unused since the Jupyter pass; kept for a scrapbook section if one comes back.)
// Deterministic jitter so the edge is the same on every render.
const seeded = (seed, i) => {
  const x = Math.sin(seed * 999 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

// Torn-paper edge at the bottom of a section. `color` is the NEXT section's background.
export const TornEdge = ({ color = 'var(--cream)', seed = 1, height = 22, className = '' }) => {
  const pts = [];
  for (let x = 0; x <= 1000; x += 14) pts.push(`${x} ${(seeded(seed, x) * 0.85 * 20).toFixed(1)}`);
  return (
    <svg
      className={`absolute left-0 right-0 bottom-[-1px] w-full pointer-events-none z-[2] ${className}`}
      style={{ height }}
      viewBox="0 0 1000 20"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={`M0 20 L0 ${pts[0].split(' ')[1]} L${pts.join(' L')} L1000 20 Z`} fill={color} />
    </svg>
  );
};
