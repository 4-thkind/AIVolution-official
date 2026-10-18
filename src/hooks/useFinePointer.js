import { useMediaQuery } from './useMediaQuery';

// Mouse/trackpad only. Drag toys are disabled on touch so they never hijack scrolling.
export const useFinePointer = () => useMediaQuery('(pointer: fine)');
