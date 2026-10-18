import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { EVENTS_DESC } from './eventDate';
import { shortHash } from './scrap';

// `git log --oneline` of the society: one commit per real event, newest first.
// Scroll speed fast-forwards (or rewinds) the log.
const COMMITS = EVENTS_DESC.map((e) => ({ hash: shortHash(e.id), msg: `${e.title} (${e.date})` }));

const Track = ({ className }) => (
  <div className={`nb-marquee ${className}`}>
    {[...COMMITS, ...COMMITS].map((c, i) => (
      <span key={i} className="flex items-center gap-4">
        <span className="text-[#ffb86b]">{c.hash}</span>
        <span>{c.msg}</span>
      </span>
    ))}
  </div>
);

export const GitLog = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tween = gsap.to('.log-track', { xPercent: -50, duration: 45, ease: 'none', repeat: -1 });
      const clamp = gsap.utils.clamp(-8, 8);
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          gsap.fromTo(tween, { timeScale: clamp(1 + self.getVelocity() / 220) }, { timeScale: 1, duration: 1.6, ease: 'power2.out', overwrite: true });
        },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="screen border-y-2 border-ink font-mono text-sm md:text-base" aria-hidden="true">
      <div className="relative z-[2] flex items-stretch overflow-hidden">
        <div className="shrink-0 flex items-center gap-3 px-4 md:px-6 py-3 border-r border-mint/30 bg-screen">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span className="text-mint">$ git log --oneline</span>
          <span className="hidden sm:inline text-[#d7f5e3]/50">{COMMITS.length} commits</span>
        </div>
        <div className="flex-1 flex items-center overflow-hidden py-3 text-[#d7f5e3]">
          <Track className="log-track" />
        </div>
      </div>
    </div>
  );
};
