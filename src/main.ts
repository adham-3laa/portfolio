/**
 * main.ts
 * Phase 7 bootstrap updates:
 *  - Keeps core stylesheet in the initial path.
 *  - Defers motion-only stylesheet loading.
 *  - Preserves existing initialization flow.
 */

import './styles/main.css';
import { initHero } from './scripts/hero';
import { initPortrait } from './scripts/portrait';
import { initSkills } from './scripts/skills';
import { initProjects } from './scripts/projects';
import { initScroll } from './scripts/scroll';
import { initSectionReveals, initTitleReveals, initFeatureIconReveals } from './scripts/reveal';
import { initScreenshotReveal, initScreenshotTilt, initCtaBorderDraw } from './scripts/projects-motion';
import { initNavScroll } from './scripts/nav-scroll';
import { initSpineScroll } from './scripts/spine';
import { initMobileNav } from './scripts/mobile-nav';
import { initClinicGallery } from './scripts/clinic-gallery';

let deferredMotionStylesPromise: Promise<unknown> | null = null;

function loadDeferredMotionStyles(): Promise<void> {
  if (!deferredMotionStylesPromise) {
    deferredMotionStylesPromise = import('./styles/animations.css');
  }

  return deferredMotionStylesPromise.then(() => undefined);
}

async function init(): Promise<void> {
  const requiredLandmarks = ['site-header', 'site-main', 'site-footer', 'site-nav', 'contact'];

  for (const id of requiredLandmarks) {
    if (!document.getElementById(id)) {
      console.warn(`[Portfolio] Missing landmark element: #${id}`);
    }
  }

  document.documentElement.setAttribute('data-js', 'true');

  // Phase 3.
  initHero();
  initPortrait();

  // Phase 4.
  initSkills();

  // Phase 5.
  initProjects();

  // Phase 7: defer non-critical motion CSS while preserving motion behavior.
  await loadDeferredMotionStyles().catch(() => {
    console.warn('[Portfolio] Failed to load deferred motion stylesheet.');
  });

  // Phase 6 motion layer.
  initScroll();
  initSectionReveals();
  initTitleReveals();
  initFeatureIconReveals();
  initScreenshotReveal();
  initScreenshotTilt();
  initCtaBorderDraw();
  initNavScroll();
  initSpineScroll();
  initMobileNav();
  
  // Clinic Gallery
  initClinicGallery();
}

function bootstrap(): void {
  void init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
