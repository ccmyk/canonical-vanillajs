
// src/types/global.d.ts
declare global {
  interface Window {
    gsap: typeof import('gsap').gsap;
    SplitType: typeof import('split-type').default;
    Lenis: typeof import('lenis').default;
    lerp: (p1: number, p2: number, t: number) => number;
    clamp: (min: number, max: number, num: number) => number;
    waiter: (ms: number) => Promise<void>;
  }
}

// This is needed to make the file a module.
export {};
