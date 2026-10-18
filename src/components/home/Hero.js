import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { DEPARTMENTS } from '../../data/departments';
import { EVENTS } from '../../data/events';
import { useDraggable } from './useDraggable';
import { willBoot, BOOT_SECONDS } from './Boot';
import { SectionLabel, Mark, Tape, PostIt, Scribble, Sticker, StickerButton, Perforation, shortHash, WHATSAPP } from './scrap';

// Hand-drawn network of what the society actually is:
// what we run (event types) → who runs it (the four departments) → AI creators.
const INPUTS = ['hackathons', 'workshops', 'webinars', 'industrial visits'];
const HIDDEN = DEPARTMENTS.map((d) => d.title.replace('Management', 'Mgmt').replace('Public Relations', 'PR'));
// Portrait: flows top → bottom so it fills the right column instead of a thin strip.
const Y = { input: 100, hidden: 340, output: 575 };
const xs = (n) => Array.from({ length: n }, (_, i) => 52 + i * 126);

const NeuralDoodle = ({ className }) => {
  const ix = xs(INPUTS.length);
  const hx = xs(HIDDEN.length);
  const ox = 52 + ((HIDDEN.length - 1) * 126) / 2;
  return (
    <svg viewBox="0 0 480 640" className={className} fill="none" overflow="visible" aria-hidden="true">
      <defs>
        <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence baseFrequency="0.02" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <g stroke="var(--pen)" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" filter="url(#wobble)">
        {ix.flatMap((x1) => hx.map((x2) => (
          <path key={`i${x1}-${x2}`} className="edge" d={`M${x1} ${Y.input} C ${x1} ${Y.input + 120}, ${x2} ${Y.hidden - 120}, ${x2} ${Y.hidden}`} />
        )))}
        {hx.map((x1) => (
          <path key={`h${x1}`} className="edge" d={`M${x1} ${Y.hidden} C ${x1} ${Y.hidden + 110}, ${ox} ${Y.output - 110}, ${ox} ${Y.output}`} />
        ))}
      </g>
      <g className="font-mono" fontSize="10" fill="var(--pencil)" letterSpacing="2">
        <text x="0" y={Y.input - 62}>WHAT WE RUN</text>
        <text x="0" y={Y.hidden + 78}>WHO RUNS IT</text>
        <text x={ox} y={Y.output + 84} textAnchor="middle">OUTPUT</text>
      </g>
      <g className="font-hand" fontSize="20" fill="var(--pencil)">
        {ix.map((x, i) => <text key={i} x={x} y={Y.input - (i % 2 ? 44 : 24)} textAnchor="middle">{INPUTS[i]}</text>)}
        {hx.map((x, i) => <text key={i} x={x} y={Y.hidden + (i % 2 ? 54 : 36)} textAnchor="middle">{HIDDEN[i]}</text>)}
        <text x={ox} y={Y.output + 56} textAnchor="middle" fontSize="28" fill="var(--ink)" fontWeight="700">AI creators</text>
      </g>
      <g>
        {ix.map((x) => <circle key={`i${x}`} className="node" cx={x} cy={Y.input} r="12" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />)}
        {hx.map((x) => <circle key={`h${x}`} className="node" cx={x} cy={Y.hidden} r="12" fill="var(--highlight)" stroke="var(--ink)" strokeWidth="2.5" />)}
        <circle className="node" cx={ox} cy={Y.output} r="19" fill="var(--marker)" stroke="var(--ink)" strokeWidth="2.5" />
      </g>
    </svg>
  );
};

// Real numbers from src/data/events.js, as fridge-magnet stickers you can fling.
const STICKERS = [
  { text: "Codex Hackathon '25 · 60+ teams", bg: '#ffe85c', r: -8, cls: 'top-[15%] right-[26%] hidden lg:inline-flex' },
  { text: '₹19,000+ in prizes', bg: '#141414', fg: '#f3eee2', r: 6, cls: 'top-[13%] right-[3%]' },
  { text: 'hands-on, not slides', bg: '#ff8fb1', r: -5, cls: 'bottom-[13%] right-[30%] hidden lg:inline-flex' },
  { text: 'build it, don\'t just watch', bg: '#2f6bff', fg: '#fff', r: 9, cls: 'top-[47%] right-[0%] hidden 2xl:inline-flex' },
];

const featured = EVENTS.find((e) => e.featured) || EVENTS[0];

export const Hero = () => {
  const root = useRef(null);
  useDraggable(root, '.hero-sticker');

  useGSAP(
    () => {
      const delay = willBoot() ? BOOT_SECONDS - 0.2 : 0.15;
      const tl = gsap.timeline({ delay, defaults: { ease: 'expo.out' } });
      tl.from('.mask-line > span', { yPercent: 110, duration: 1.1, stagger: 0.1 })
        .from('.hero-fade', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.6')
        .add(() => root.current.classList.add('is-visible'), '-=0.4')
        .from('.hero-sticker', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)', stagger: 0.07 }, '-=0.5');

      if (prefersReducedMotion()) return undefined;
      gsap.from('.edge', { drawSVG: '0%', duration: 1.4, ease: 'power2.inOut', stagger: 0.03, delay: delay + 0.2 });
      gsap.to('.node', {
        scale: 1.25, transformOrigin: 'center', duration: 1.4, ease: 'sine.inOut',
        yoyo: true, repeat: -1, stagger: { each: 0.12, from: 'random' },
      });
      gsap.to('.scroll-cue', { y: 6, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      return undefined;
    },
    { scope: root }
  );

  // Pointer flashlight reveals the blue ink grid (plain effect: useGSAP ignores returned cleanups).
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return undefined;
    const move = (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - b.left}px`);
      el.style.setProperty('--my', `${e.clientY - b.top}px`);
    };
    el.addEventListener('pointermove', move, { passive: true });
    return () => el.removeEventListener('pointermove', move);
  }, []);

  return (
    <section id="home" ref={root} className="relative min-h-[100svh] overflow-hidden dotgrid flex items-center">
      <div className="inkgrid absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="relative z-[3] w-full max-w-[1500px] mx-auto px-5 sm:px-8 md:px-12 pt-28 pb-24 md:pt-32 grid gap-12 lg:gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-[660px]">
          <div className="hero-fade flex flex-wrap items-center gap-3 mb-6">
            <SectionLabel bare><span className="text-pen font-bold">⎇ main</span> · public</SectionLabel>
            <Tape rotate={-2} stripe>official AI society · dept. of CSE-AI, MAIT</Tape>
          </div>

          <h1 className="text-[clamp(2.9rem,6.4vw,6.6rem)]">
            <span className="mask-line"><span>we turn AI</span></span>
            <span className="mask-line"><span><span className="strike font-hand font-medium tracking-normal text-pencil">users</span> into</span></span>
            <span className="mask-line"><span><Mark>AI creators.</Mark></span></span>
          </h1>

          <p className="hero-fade mt-7 max-w-xl text-lg md:text-xl leading-relaxed text-pencil">
            A student-led ecosystem at Maharaja Agrasen Institute of Technology for those who refuse to
            simply watch the future unfold — hands-on learning, industry collaboration, competitive
            challenges, and experiential projects.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center gap-4">
            <StickerButton href={WHATSAPP} target="_blank" rel="noreferrer" bg="var(--highlight)" rotate={-1.5}>
              Join AIvolutions <span aria-hidden="true">→</span>
            </StickerButton>
            <StickerButton to="/events" bg="#fff" rotate={1}>See our events</StickerButton>
          </div>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
            <SectionLabel bare>latest commit</SectionLabel>
            <Link
              to={`/events?e=${featured.id}`}
              className="group inline-flex items-center gap-4 border-2 border-ink bg-cream pl-2 pr-4 py-2 shadow-[4px_4px_0_var(--ink)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <img src={featured.imgUrl} alt="" width="56" height="56" className="w-14 h-14 object-cover border border-ink" />
              <span>
                <span className="block font-bricolage font-extrabold text-lg leading-tight">{featured.title}</span>
                <span className="block font-mono text-xs text-pencil"><span className="text-marker">{shortHash(featured.id)}</span> · {featured.date} · {featured.facts.slice(0, 2).join(' · ')}</span>
              </span>
              <span className="font-bricolage font-extrabold text-xl transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto lg:mr-6 xl:mr-10">
          <NeuralDoodle className="hero-fade w-full max-w-[440px] lg:max-w-none lg:w-auto lg:h-[min(74vh,860px)] select-none pointer-events-none" />
          <div className="hero-fade hidden lg:flex items-end gap-0 absolute bottom-2 left-[62%]">
            <Scribble className="w-14 mb-6 shrink-0" flip />
            <PostIt rotate={4} className="text-xl whitespace-nowrap">where curiosity<br />becomes capability</PostIt>
          </div>
        </div>
      </div>

      {STICKERS.map((s) => (
        <Sticker key={s.text} className={`hero-sticker absolute z-[4] ${s.cls}`} bg={s.bg} fg={s.fg} data-r={s.r}>
          {s.text}
        </Sticker>
      ))}

      <p className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] font-mono text-[0.68rem] tracking-[0.18em] uppercase text-pencil whitespace-nowrap">
        ↓ README.md
      </p>
      <Perforation />
    </section>
  );
};
