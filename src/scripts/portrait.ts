/**
 * portrait.ts
 * Phase 3 pointer tilt.
 * Phase 7 update: compositor hints are enabled only during active pointer motion.
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH_DEVICE = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const IS_SMALL_LAYOUT = window.matchMedia('(max-width: 1024px)').matches;

const MAX_ROTATE_X = 6;
const MAX_ROTATE_Y = 6;

export function initPortrait(): void {
  if (REDUCED_MOTION || IS_TOUCH_DEVICE || IS_SMALL_LAYOUT) return;

  const hero = document.getElementById('hero');
  const scene = document.querySelector<HTMLElement>('.hero__portrait-scene');
  const stack = scene?.querySelector<HTMLElement>('.portrait-stack') ?? null;

  if (!hero || !scene || !stack) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = 0;
  let active = false;

  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

  const setHints = (value: 'transform' | 'auto'): void => {
    scene.style.willChange = value;
    stack.style.willChange = value;
  };

  const animate = (): void => {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);

    scene.style.setProperty('--tilt-x', `${currentX.toFixed(3)}deg`);
    scene.style.setProperty('--tilt-y', `${currentY.toFixed(3)}deg`);

    const isStillSettling =
      Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01;

    if (active || isStillSettling) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    setHints('auto');
  };

  const onPointerMove = (event: PointerEvent): void => {
    const rect = hero.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    targetX = -ny * MAX_ROTATE_X;
    targetY = nx * MAX_ROTATE_Y;
    setHints('transform');

    if (!active) {
      active = true;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    }
  };

  const onPointerLeave = (): void => {
    active = false;
    targetX = 0;
    targetY = 0;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(animate);
  };

  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', onPointerLeave, { passive: true });
}
