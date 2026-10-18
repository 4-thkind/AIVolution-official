import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { useReveal } from '../../hooks/useReveal';
import { Hand, SectionLabel } from './scrap';
import { ABOUT_TAGLINE } from '../../data/about';
import { EVENTS } from '../../data/events';
import { DEPARTMENTS } from '../../data/departments';
import { FACULTY } from '../../data/faculty';
import { TEAM } from '../../data/team';
import { SPONSORS } from '../../data/sponsors';

// Repo stats, all derived from the data files.
const STATS = [
  ['commits', EVENTS.length, 'events so far'],
  ['branches', DEPARTMENTS.length, 'departments'],
  ['contributors', TEAM.length, 'core team'],
  ['maintainers', FACULTY.length, 'faculty'],
  ['sponsors', SPONSORS.length, 'partners'],
];

// "Languages" bar = share of events by type.
const TYPE_COLORS = { competition: 'var(--marker)', workshop: 'var(--pen)', webinar: 'var(--mint)', visit: 'var(--pink)', gallery: 'var(--highlight)' };
const counts = EVENTS.reduce((m, e) => ({ ...m, [e.type]: (m[e.type] || 0) + 1 }), {});
const LANGS = Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .map(([type, n]) => ({ type, n, pct: (n / EVENTS.length) * 100, color: TYPE_COLORS[type] || 'var(--pencil)' }));

export const FooterArt = () => {
  const root = useRef(null);
  useReveal(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.lang-seg', {
        scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.lang-bar', start: 'top 85%', once: true },
      });
      gsap.from('.stat-n', {
        innerText: 0, snap: 'innerText', duration: 1.2, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: '.stats', start: 'top 85%', once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-paper overflow-hidden pt-20 pb-16 px-5 sm:px-8">
      <div className="relative z-[2] max-w-7xl mx-auto">
        <div className="reveal">
          <SectionLabel bare><span className="text-pen font-bold">⎇ main</span> · public</SectionLabel>
          <h2 className="mt-2 text-[clamp(2.4rem,8vw,7.5rem)] leading-[0.9]">AIvolutions</h2>
          <p className="mt-4 max-w-2xl text-lg text-pencil">{ABOUT_TAGLINE.replace('// ', '')}</p>
        </div>

        <div className="reveal mt-12" style={{ '--reveal-i': 1 }}>
          <p className="font-mono text-xs tracking-[0.18em] uppercase text-pencil mb-3">activity by type</p>
          <div className="lang-bar flex h-3 w-full overflow-hidden border-2 border-ink bg-cream">
            {LANGS.map((l) => (
              <span key={l.type} className="lang-seg h-full" style={{ width: `${l.pct}%`, background: l.color }} />
            ))}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm">
            {LANGS.map((l) => (
              <li key={l.type} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-ink" style={{ background: l.color }} />
                <span className="capitalize">{l.type}</span>
                <span className="text-pencil">{l.pct.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>

        <dl className="stats reveal mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 font-mono" style={{ '--reveal-i': 2 }}>
          {STATS.map(([label, n, sub]) => (
            <div key={label} className="border-l-2 border-ink/20 pl-3">
              <dd className="stat-n font-bricolage font-extrabold text-3xl md:text-4xl text-ink leading-none">{n}</dd>
              <dt className="text-[0.65rem] tracking-[0.18em] uppercase text-pencil mt-1">{label} <span className="normal-case tracking-normal opacity-70">· {sub}</span></dt>
            </div>
          ))}
        </dl>

        <Hand className="reveal block mt-12 text-2xl md:text-3xl text-pencil" rotate={-1.5} style={{ '--reveal-i': 3 }}>
          dept. of CSE-AI · Maharaja Agrasen Institute of Technology
        </Hand>
      </div>
    </section>
  );
};
