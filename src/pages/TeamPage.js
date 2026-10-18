import React, { useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { useReveal } from '../hooks/useReveal';
import { TEAM, TEAM_DEPARTMENTS, DEPT_TONE, isOfficeBearer } from '../data/team';
import { SectionLabel, Hand, Tape, PostIt, StickerButton, Perforation, WHATSAPP } from '../components/home/scrap';
import { MemberCard } from '../components/team/MemberCard';

const OFFICE = TEAM.filter(isOfficeBearer);
const OFFICE_ROLES = [...new Set(OFFICE.map((m) => m.role))].join(' · ').toLowerCase();
const TABS = [{ key: 'all', label: 'all' }, ...TEAM_DEPARTMENTS];

export const TeamPage = () => {
  const root = useRef(null);
  const [params] = useSearchParams();
  const dept = TEAM_DEPARTMENTS.some((d) => d.key === params.get('dept')) ? params.get('dept') : 'all';
  const members = dept === 'all' ? TEAM : TEAM.filter((m) => m.dept === dept);
  useReveal(root);

  // Deal the cards in: on first load, and again whenever the tab changes.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.office .card-wrap', { y: 50, rotation: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.1, delay: 0.2, clearProps: 'transform' });
    },
    { scope: root }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('.deck .card-wrap', { y: 40, rotation: (i) => (i % 2 ? 5 : -5), opacity: 0, duration: 0.55, ease: 'back.out(1.5)', stagger: 0.05, clearProps: 'transform' });
    },
    { scope: root, revertOnUpdate: true, dependencies: [dept] }
  );

  return (
    <main ref={root} className="nb min-h-screen bg-paper dotgrid">
      <div className="relative z-[2] max-w-7xl mx-auto px-5 sm:px-8 md:px-12 pt-28 md:pt-36 pb-24">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel path="team/" />
            <h2 className="mt-4 text-[clamp(2.8rem,7vw,7rem)]">the core team.</h2>
            <Hand className="block mt-3 text-2xl text-pencil" rotate={-1.5}>{TEAM.length} members · {TEAM_DEPARTMENTS.length} departments · collect them all</Hand>
          </div>
          <PostIt rotate={3} className="text-lg">hover a card —<br />they tilt.</PostIt>
        </div>

        {/* office bearers */}
        <section className="office mt-12">
          <div className="reveal flex flex-wrap items-center gap-3" style={{ '--reveal-i': 1 }}>
            <Tape rotate={-2} stripe>{OFFICE_ROLES}</Tape>
            <p className="font-mono text-xs text-pencil">{OFFICE.length} · foil edition</p>
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {OFFICE.map((m) => <MemberCard key={m.name} m={m} big />)}
          </div>
        </section>

        {/* departments */}
        <section className="mt-16">
          <div className="reveal flex flex-wrap items-center gap-3" style={{ '--reveal-i': 2 }}>
            <Tape rotate={-2}>departments/</Tape>
            <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter by department">
              {TABS.map((t) => {
                const active = dept === t.key;
                const tone = DEPT_TONE[t.key] || 'var(--highlight)';
                return (
                  <Link
                    key={t.key}
                    to={t.key === 'all' ? '/team' : `/team?dept=${t.key}`}
                    className={`shrink-0 px-3.5 py-1.5 border-2 border-ink font-mono text-xs font-bold transition-transform duration-150 hover:-translate-y-0.5 ${active ? 'text-ink shadow-[3px_3px_0_var(--ink)]' : 'bg-cream text-pencil'}`}
                    style={active ? { background: tone } : undefined}
                    aria-current={active ? 'page' : undefined}
                  >
                    {t.label}{t.key !== 'all' && <span className="opacity-60"> · {TEAM.filter((m) => m.dept === t.key).length}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div key={dept} className="deck mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {members.map((m) => <MemberCard key={`${m.dept}-${m.name}`} m={m} />)}
          </div>
        </section>

        <div className="mt-20 flex flex-wrap items-center gap-5">
          <StickerButton href={WHATSAPP} target="_blank" rel="noreferrer" bg="var(--highlight)" rotate={-1.5}>want a card? connect →</StickerButton>
          <Link to="/#contributors" className="squiggle font-bricolage font-extrabold text-lg">faculty on the homepage →</Link>
        </div>
      </div>
      <Perforation color="var(--cream)" />
    </main>
  );
};
