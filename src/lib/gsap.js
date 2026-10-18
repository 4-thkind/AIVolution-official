import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Registered once; every homepage section imports gsap from here.
gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, DrawSVGPlugin, ScrambleTextPlugin);
gsap.defaults({ ease: 'power3.out' });

// Pinned stages, drag toys and velocity effects only run under this query.
export const HEAVY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
export const LIGHT = '(max-width: 1023px), (prefers-reduced-motion: reduce)';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, Draggable };
