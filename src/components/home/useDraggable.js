import { useGSAP } from '@gsap/react';
import { gsap, Draggable, prefersReducedMotion } from '../../lib/gsap';

// Makes every `selector` match inside `scopeRef` grab-and-flingable (desktop only).
// Elements may carry data-r="<deg>" for a resting rotation.
export const useDraggable = (scopeRef, selector, { bounds, deps = [] } = {}) => {
  useGSAP(
    () => {
      const items = gsap.utils.toArray(selector, scopeRef.current);
      items.forEach((el) => gsap.set(el, { rotation: Number(el.dataset.r || 0) }));

      if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return undefined;

      const instances = Draggable.create(items, {
        type: 'x,y',
        inertia: true,
        bounds: bounds || scopeRef.current,
        edgeResistance: 0.75,
        zIndexBoost: true,
        onPress() { gsap.to(this.target, { scale: 1.08, duration: 0.2 }); },
        onRelease() { gsap.to(this.target, { scale: 1, duration: 0.35, ease: 'back.out(2)' }); },
      });
      return () => instances.forEach((d) => d.kill());
    },
    { scope: scopeRef, revertOnUpdate: true, dependencies: deps }
  );
};
