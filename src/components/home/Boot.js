import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

const SESSION_KEY = 'aiv:booted';
const hasBooted = () => {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
};
// True when the boot veil will play this page load (Hero delays its entrance to match).
export const willBoot = () => typeof window !== 'undefined' && !hasBooted() && !prefersReducedMotion();
export const BOOT_SECONDS = 1.7;

const LINES = [
  '> mounting notebook',
  '> loading weights',
  '> caffeine level: ok',
  '> opening cover',
];

// Session-once "terminal" cover page that slides up to reveal the notebook.
export const Boot = () => {
  const [show, setShow] = useState(willBoot);
  const root = useRef(null);

  useGSAP(
    () => {
      if (!show) return undefined;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const lines = gsap.utils.toArray('.boot-line', root.current);
      let tl;
      const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Tab') { if (tl) tl.kill(); finish(); } };

      // useGSAP ignores returned cleanups, so the key listener is removed here.
      const finish = () => {
        try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* optional */ }
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', onKey);
        setShow(false);
      };

      tl = gsap.timeline({ onComplete: finish });
      lines.forEach((el, i) => {
        tl.to(el, { duration: 0.28, scrambleText: { text: LINES[i], chars: '01▒░█<>/', speed: 0.5 } }, i * 0.22);
      });
      tl.to('.boot-bar', { width: '100%', duration: 0.9, ease: 'power2.inOut' }, 0.3)
        .to('.boot-pct', { innerText: 100, snap: 'innerText', duration: 0.9, ease: 'power2.inOut' }, 0.3)
        .to(root.current, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, BOOT_SECONDS - 0.8);

      window.addEventListener('keydown', onKey);
      return undefined;
    },
    { scope: root, revertOnUpdate: true, dependencies: [show] }
  );

  if (!show) return null;
  return (
    <div ref={root} className="screen grain grain--light fixed inset-0 z-[100] flex items-center justify-center" role="status" aria-live="polite">
      <div className="relative z-[2] w-[min(90vw,420px)] font-mono text-sm leading-7 text-[#d7f5e3]">
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-mint/70 mb-3">aivolutions · lab notebook</p>
        {LINES.map((l) => <p key={l} className="boot-line min-h-[1.75rem]" />)}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 border border-mint/40 p-[2px]">
            <div className="boot-bar h-full w-0 bg-mint" />
          </div>
          <span><span className="boot-pct">0</span>%</span>
        </div>
        <p className="mt-3 text-[0.65rem] text-[#d7f5e3]/40">esc to skip</p>
      </div>
    </div>
  );
};
