import { prefersReducedMotion } from './gsap';

// Seconds after the preloader mounts until the curtain starts lifting.
export const PRELOADER_EXIT_AT = 4.2;
// The page intro (Hero, network) starts this long after mount, while the curtain is mid-lift.
export const PRELOADER_REVEAL_SECONDS = PRELOADER_EXIT_AT + 0.35;

let played = false;

// True while the preloader will still play on this page load; the Hero delays its entrance to match.
export const willPreload = () => !played && !prefersReducedMotion();
export const markPreloaded = () => { played = true; };
