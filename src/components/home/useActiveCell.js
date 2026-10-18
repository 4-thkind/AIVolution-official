import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from '../../lib/gsap';

// Jupyter-style "active cell": the section's left bracket turns blue while it's on screen.
export const useActiveCell = (rootRef) => {
  useGSAP(
    () => {
      ScrollTrigger.create({ trigger: rootRef.current, start: 'top 65%', end: 'bottom 35%', toggleClass: 'is-active' });
    },
    { scope: rootRef }
  );
};
