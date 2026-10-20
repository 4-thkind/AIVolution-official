import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/gsap';
import { PRELOADER_EXIT_AT, willPreload, markPreloaded } from '../lib/preloader';
import { Tape, Stamp, Sticker, Hand, Mark, Scribble } from './home/scrap';
import '../styles/preloader.css';

const ART = `${process.env.PUBLIC_URL}/assets/preloader`;
const LAYERS = ['ai-hand', 'ink', 'human-hand', 'spark'];
// public/index.html paints this paper-coloured cover before the JS bundle runs.
const SHELL_ID = 'preload-shell';
const TOUCH = { x: '57.48%', y: '52.21%' };
const FLARE = 2.0;
const SKIP_SECONDS = 0.6;
const SKIP_KEYS = ['Escape', 'Tab', 'Enter', ' '];

// Pointer parallax: the art drifts a little, the scraps (closer to the viewer) drift the other way.
const DRIFT = { art: 9, scraps: -16 };
const BURST = 12;
const EDGE_H = 28;

// Same site copy as the Hero stickers.
const STICKERS = [
  { text: 'hands-on, not slides', bg: '#c4a582', r: -5, cls: 'pl-scrap--stk1' },
  { text: "build it, don't just watch", bg: '#3f8576', fg: '#f3eee2', r: 4, cls: 'pl-scrap--stk2' },
];

// Torn-paper lower edge for the curtain, in the spirit of TornEdge in home/scrap.js, but hanging
// below the sheet. Three jagged layers: a soft shadow, a pale paper fibre, then the sheet itself.
const tear = (seed, lo, hi) => {
  const pts = [];
  for (let x = 0; x <= 1000; x += 12) {
    const j = Math.sin(seed * 999 + x * 12.9898) * 43758.5453;
    pts.push(`${x} ${(lo + (j - Math.floor(j)) * (hi - lo)).toFixed(1)}`);
  }
  return `M0 0 L${pts.join(' L')} L1000 0 Z`;
};
const TEAR = [
  { d: tear(3, 10, 27), fill: 'rgba(20, 20, 20, 0.12)' },
  { d: tear(2, 8, 22), fill: '#fbf8ef' },
  { d: tear(1, 6, 17), fill: '#f3eee2' },
];

const loadLayer = (name) => new Promise((resolve) => {
  const img = new Image();
  img.onload = resolve;
  img.onerror = resolve;
  img.src = `${ART}/${name}.webp`;
  if (img.decode) img.decode().then(resolve, resolve);
});

// Full-screen intro, once per page load: the AI hand and the human hand reach for each other,
// the spark flares where they touch, and the AIvolutions mark inks in around it.
export const Preloader = () => {
  const [show, setShow] = useState(willPreload);
  const [ready, setReady] = useState(false);
  const root = useRef(null);
  const tlRef = useRef(null);
  const skipRequested = useRef(false);
  const mountedAt = useRef(gsap.ticker.time);

  useLayoutEffect(() => {
    const shell = document.getElementById(SHELL_ID);
    if (shell) shell.remove();
  }, []);

  useEffect(() => {
    if (!show) return undefined;
    let alive = true;
    const slow = new Promise((resolve) => setTimeout(resolve, 3000));
    Promise.race([Promise.all(LAYERS.map(loadLayer)), slow]).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, [show]);

  useEffect(() => {
    if (!show) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [show]);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!show || !fine || prefersReducedMotion()) return undefined;
    const move = (target, amount) => {
      const el = root.current.querySelector(target);
      const opts = { duration: 0.9, ease: 'power3' };
      return { x: gsap.quickTo(el, 'x', opts), y: gsap.quickTo(el, 'y', opts), amount };
    };
    const layers = [move('.pl-art', DRIFT.art), move('.pl-scraps', DRIFT.scraps)];
    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.amount * 2); l.y(ny * l.amount * 2); });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [show]);

  // The page intro waits on a wall-clock delay measured from mount. Skipping fast-forwards
  // GSAP's clock until the curtain starts to lift, so the preloader and that delay stay in step.
  const skip = () => {
    const tl = tlRef.current;
    if (!tl) { skipRequested.current = true; return; }
    const remaining = PRELOADER_EXIT_AT - tl.time();
    if (remaining < 0.05 || gsap.globalTimeline.timeScale() > 1) return;
    gsap.globalTimeline.timeScale(remaining / SKIP_SECONDS);
  };

  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => { if (SKIP_KEYS.includes(e.key)) skip(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      gsap.globalTimeline.timeScale(1);
    };
  }, [show]);

  useGSAP(
    () => {
      if (!show || !ready) return undefined;
      const pct = root.current.querySelector('.pl-pct');
      const count = { v: 0 };
      const at = `${TOUCH.x} ${TOUCH.y}`;

      const stageH = root.current.querySelector('.pl-stage').offsetHeight;
      const dots = gsap.utils.toArray('.pl-dot');
      const angle = (i) => (i / BURST) * Math.PI * 2 + (i % 2 ? 0.18 : -0.1);
      const reach = (i) => stageH * (0.13 + ((i * 7) % 5) * 0.035);
      // The arrow's shaft is drawn first, then its head.
      const draw = (arrow, at) => tl
        .fromTo(`${arrow} path:first-child`, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.55, ease: 'power2.inOut' }, at)
        .fromTo(`${arrow} path:last-child`, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.2, ease: 'power1.out' }, at + 0.5);

      gsap.set('.pl-fx', { xPercent: -50, yPercent: -50 });
      gsap.set('.pl-stk', { rotation: (i, el) => Number(el.dataset.r) });
      gsap.set('.pl-cross--v', { rotation: 90 });
      gsap.set('.pl-arrow path', { drawSVG: '0%' });
      gsap.set('.pl-spark', { transformOrigin: at });

      const finish = () => {
        gsap.globalTimeline.timeScale(1);
        markPreloaded();
        setShow(false);
      };

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;
      const notes = gsap.utils.toArray('.pl-note .mark');

      tl.to(count, {
        v: 100, duration: PRELOADER_EXIT_AT - 0.2, ease: 'power1.inOut',
        onUpdate: () => { pct.textContent = String(Math.round(count.v)).padStart(3, '0'); },
      }, 0)
        .to('.pl-hud-bar', { scaleX: 1, duration: PRELOADER_EXIT_AT - 0.2, ease: 'power1.inOut' }, 0)

        // 1 · a seed of light, a glow in the monitor, and both hands appear as faint ghosts
        .fromTo('.pl-core', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.2)' }, 0.1)
        .fromTo('.pl-glow--monitor', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.3, ease: 'sine.out' }, 0.35)
        .fromTo('.pl-ai', { opacity: 0, xPercent: -3.5, yPercent: -3 }, { opacity: 0.3, xPercent: -1.6, yPercent: -1.3, duration: 0.95, ease: 'sine.out' }, 0.4)
        .fromTo('.pl-human', { opacity: 0, xPercent: 3.5, yPercent: 3.5 }, { opacity: 0.3, xPercent: 1.6, yPercent: 1.6, duration: 0.95, ease: 'sine.out' }, 0.55)
        .fromTo('.pl-glow--spark', { scale: 0.3, opacity: 0 }, { scale: 0.8, opacity: 0.5, duration: 1.2, ease: 'sine.inOut' }, 0.7)

        // taped to the page: both strips drop in while the art is still a ghost
        .fromTo('.pl-tape--a', { y: -60, opacity: 0, rotation: -12 }, { y: 0, opacity: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.8)' }, 0.7)
        .fromTo('.pl-tape--b', { y: -60, opacity: 0, rotation: 12 }, { y: 0, opacity: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.8)' }, 0.9)

        // 2 · the hands firm up and close the gap; the spark swells
        .to(['.pl-ai', '.pl-human'], { opacity: 1, xPercent: 0, yPercent: 0, duration: 1.1, ease: 'power2.inOut' }, 1.0)
        .to('.pl-core', { scale: 1.8, duration: 1.0, ease: 'power2.in' }, 1.0)
        .fromTo('.pl-note-text', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, 1.0)
        .add(() => notes.forEach((n) => n.classList.add('is-on')), 1.9)

        // 3 · contact: flare, shockwave, and the mark inks in from the touch point
        .addLabel('flare', FLARE)
        .to('.pl-core', { scale: 4.2, duration: 0.22, ease: 'expo.out' }, 'flare')
        .to('.pl-core', { scale: 1.6, duration: 0.9, ease: 'power3.out' }, 'flare+=0.22')
        .to('.pl-glow--spark', { scale: 1.1, opacity: 0.85, duration: 0.3, ease: 'power2.out' }, 'flare')
        .to('.pl-glow--spark', { scale: 0.9, opacity: 0.45, duration: 1.0, ease: 'power2.inOut' }, 'flare+=0.3')
        .fromTo('.pl-ring', { scale: 0.3, opacity: 0.9 }, { scale: 7, opacity: 0, duration: 1.3, ease: 'power2.out' }, 'flare')
        .fromTo('.pl-cross', { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 0, duration: 0.8, ease: 'expo.out' }, 'flare')
        .fromTo('.pl-spark', { scale: 0.15, opacity: 0 }, { scale: 1.12, opacity: 1, duration: 0.45, ease: 'expo.out' }, 'flare+=0.02')
        .to('.pl-spark', { scale: 1, duration: 0.7, ease: 'power2.out' }, 'flare+=0.47')
        .set('.pl-ink', { opacity: 1 }, 'flare+=0.1')
        .fromTo(
          '.pl-ink',
          { clipPath: `circle(0% at ${at})` },
          { clipPath: `circle(88% at ${at})`, duration: 1.4, ease: 'power2.out' },
          'flare+=0.1'
        )
        .to('.pl-glow--monitor', { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 'flare+=0.2')
        .fromTo(
          dots,
          { x: 0, y: 0, scale: 1, opacity: 1 },
          {
            x: (i) => Math.cos(angle(i)) * reach(i), y: (i) => Math.sin(angle(i)) * reach(i),
            scale: 0.4, duration: 1.1, ease: 'power3.out', stagger: 0.015, immediateRender: false,
          },
          'flare'
        )
        .to(dots, { opacity: 0, duration: 0.5, ease: 'power1.in', stagger: 0.015 }, 'flare+=0.6')
        .fromTo('.pl-stk', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.12 }, 'flare+=0.3')
        .to('.pl-spark', { scale: 1.04, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'flare+=1.3')

        // 100%: the stamp thumps down just before the curtain goes
        .fromTo('.pl-scrap--stamp', { scale: 1.6, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.22, ease: 'power3.in' }, 3.5)
        .to('.pl-scrap--stamp', { scale: 0.93, duration: 0.06, ease: 'power1.out' }, 3.72)
        .to('.pl-scrap--stamp', { scale: 1, duration: 0.25, ease: 'back.out(3)' }, 3.78)

        // 4 · the curtain lifts; the page's own intro starts under it
        .addLabel('exit', PRELOADER_EXIT_AT)
        .call(() => gsap.globalTimeline.timeScale(1), null, PRELOADER_EXIT_AT)
        .to('.pl-hud', { opacity: 0, duration: 0.3, ease: 'power1.out' }, 'exit')
        .to('.pl-vignette', { opacity: 0, duration: 0.6, ease: 'power1.out' }, 'exit')
        .to('.pl-stage', { scale: 0.96, duration: 0.9, ease: 'power2.inOut' }, 'exit')
        .to(root.current, { yPercent: -100, y: -EDGE_H, duration: 0.95, ease: 'expo.inOut' }, 'exit');

      draw('.pl-arrow--ai', 1.1);
      draw('.pl-arrow--human', 1.3);

      // The page intro's delay is measured from mount, which includes time spent waiting on images.
      const waited = Math.min(gsap.ticker.time - mountedAt.current, 1.2);
      if (waited > 0.05) tl.time(waited);

      if (skipRequested.current) skip();
      return undefined;
    },
    { scope: root, dependencies: [show, ready] }
  );

  if (!show) return null;
  return (
    <div ref={root} className="pl" role="status" aria-live="polite" aria-label="Loading AIvolution" onPointerDown={skip}>
      <div className="pl-body">
        <div className="pl-bg dotgrid" aria-hidden="true">
          <div className="pl-inkgrid inkgrid" />
        </div>
        <div className="pl-vignette" aria-hidden="true" />
        <div className="pl-stage" aria-hidden="true">
          <div className="pl-art">
            <div className="pl-fx pl-glow pl-glow--monitor" />
            <img className="pl-layer pl-ai" src={`${ART}/ai-hand.webp`} alt="" draggable="false" />
            <img className="pl-layer pl-ink" src={`${ART}/ink.webp`} alt="" draggable="false" />
            <img className="pl-layer pl-human" src={`${ART}/human-hand.webp`} alt="" draggable="false" />
            <div className="pl-fx pl-glow pl-glow--spark" />
            <img className="pl-layer pl-spark" src={`${ART}/spark.webp`} alt="" draggable="false" />
            <svg className="pl-fx pl-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" /></svg>
            <div className="pl-fx pl-cross" />
            <div className="pl-fx pl-cross pl-cross--v" />
            {Array.from({ length: BURST }, (_, i) => <div key={i} className="pl-fx pl-dot" style={{ '--d': `${11 + (i % 3) * 3}px` }} />)}
            <div className="pl-fx pl-core" />
          </div>
          <div className="pl-scraps">
            <div className="pl-scrap pl-tape pl-tape--a"><Tape rotate={-38} stripe /></div>
            <div className="pl-scrap pl-tape pl-tape--b"><Tape rotate={-38} tone="pink" /></div>
            <div className="pl-scrap pl-note pl-note--ai">
              <Hand className="pl-note-text" rotate={-4} color="var(--pen)"><Mark color="var(--highlight)">AI</Mark></Hand>
              <span className="pl-arrow-wrap"><Scribble className="pl-arrow pl-arrow--ai" color="var(--pen)" flip /></span>
            </div>
            <div className="pl-scrap pl-note pl-note--human">
              <Hand className="pl-note-text" rotate={3}><Mark color="rgba(156, 47, 43, 0.2)">human</Mark></Hand>
              <span className="pl-arrow-wrap"><Scribble className="pl-arrow pl-arrow--human" /></span>
            </div>
            {STICKERS.map((st) => (
              <div key={st.text} className={`pl-scrap pl-stk ${st.cls}`} data-r={st.r}>
                <Sticker bg={st.bg} fg={st.fg}>{st.text}</Sticker>
              </div>
            ))}
            <div className="pl-scrap pl-scrap--stamp"><Stamp rotate={-9}>online</Stamp></div>
          </div>
        </div>
        <div className="pl-hud" aria-hidden="true">
          <div className="pl-hud-rule"><div className="pl-hud-bar" /></div>
          <div className="pl-hud-row">
            <span>loading · <span className="pl-pct">000</span>%</span>
            <span className="pl-hud-skip">tap or esc to skip</span>
          </div>
        </div>
      </div>
      <svg className="pl-tear" viewBox={`0 0 1000 ${EDGE_H}`} preserveAspectRatio="none" aria-hidden="true">
        {TEAR.map((t) => <path key={t.fill} d={t.d} fill={t.fill} />)}
      </svg>
    </div>
  );
};
