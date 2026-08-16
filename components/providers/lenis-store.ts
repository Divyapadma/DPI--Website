import type Lenis from "lenis";

// Tiny module-level singleton so PageTransition (route-change scroll reset)
// and SmoothScroll (instance owner) can share the one Lenis instance
// without wiring up a full React context for something this small.
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance() {
  return instance;
}
