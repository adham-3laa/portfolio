/**
 * hero.ts
 * Phase 3 hero intro + scroll parallax.
 * Phase 7 update: compositor hints are applied only while transforms are active.
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH_DEVICE = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const IS_SMALL_LAYOUT = window.matchMedia('(max-width: 1024px)').matches;

function buildRoleSpans(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? '';
  const words = text.split(' ').filter(Boolean);
  el.textContent = '';
  el.setAttribute('aria-label', text);

  return words.map((word, i) => {
    const span = document.createElement('span');
    span.className = 'hero__role-word';
    span.textContent = word + (i < words.length - 1 ? '\u00a0' : '');
    span.style.setProperty('--role-word-index', String(i));
    el.appendChild(span);
    return span;
  });
}

function runIntroSequence(): void {
  const spine = document.querySelector<HTMLElement>('.site-spine');
  const label = document.querySelector<HTMLElement>('.hero__label');
  const name = document.querySelector<HTMLElement>('.hero__name');
  const roleEl = document.querySelector<HTMLElement>('.hero__role');
  const lead = document.querySelector<HTMLElement>('.hero__lead');
  const ctas = document.querySelector<HTMLElement>('.hero__ctas');
  const portrait = document.querySelector<HTMLElement>('.hero__portrait-scene');
  const scrollHintEl = document.querySelector<HTMLElement>('.hero__scroll-hint');

  if (REDUCED_MOTION) {
    [spine, label, name, roleEl, lead, ctas, portrait, scrollHintEl].forEach((el) => {
      el?.classList.add('is-visible');
    });

    roleEl?.style.removeProperty('transform');
    roleEl?.style.removeProperty('opacity');
    if (roleEl) {
      buildRoleSpans(roleEl).forEach((span) => span.classList.add('is-visible'));
    }
    return;
  }

  const roleSpans = roleEl ? buildRoleSpans(roleEl) : [];

  const reveal = (el: Element | null, delay: number): void => {
    if (!el) return;
    window.setTimeout(() => el.classList.add('is-visible'), delay);
  };

  reveal(spine, 0);
  reveal(label, 300);
  reveal(name, 480);
  reveal(portrait, 680);

  if (roleEl) {
    window.setTimeout(() => {
      roleEl.classList.add('is-visible');
      roleSpans.forEach((span, i) => {
        window.setTimeout(() => span.classList.add('is-visible'), i * 90);
      });
    }, 820);
  }

  reveal(lead, 1050);
  reveal(ctas, 1280);
  reveal(scrollHintEl, 1680);
}

function initScrollParallax(): void {
  if (REDUCED_MOTION || IS_TOUCH_DEVICE || IS_SMALL_LAYOUT) return;

  const portraitScene = document.querySelector<HTMLElement>('.hero__portrait-scene');
  const heroContent = document.querySelector<HTMLElement>('.hero__content');
  if (!portraitScene) return;

  let ticking = false;
  let clearWillChangeTimer = 0;

  const setWillChange = (value: 'transform' | 'auto'): void => {
    portraitScene.style.willChange = value;
    if (heroContent) {
      heroContent.style.willChange = value;
    }
  };

  const scheduleHintCleanup = (): void => {
    window.clearTimeout(clearWillChangeTimer);
    clearWillChangeTimer = window.setTimeout(() => {
      setWillChange('auto');
    }, 180);
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      setWillChange('transform');
      portraitScene.style.setProperty('--scroll-parallax-y', `${scrollY * -0.28}px`);

      if (heroContent) {
        heroContent.style.setProperty('--scroll-content-y', `${scrollY * -0.12}px`);
      }

      scheduleHintCleanup();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

export function initHero(): void {
  runIntroSequence();
  initScrollParallax();
}
