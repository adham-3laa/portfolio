/**
 * mobile-nav.ts
 * Phase 8 - Mobile drawer behavior for small viewports.
 *
 * Responsibilities:
 *  1. Toggle drawer open/close state.
 *  2. Lock background scroll while open.
 *  3. Close on Escape, overlay click, and nav selection.
 *  4. Keep focus contained in the drawer while open.
 */

import { getLenis } from './scroll';

const MOBILE_BREAKPOINT_QUERY = window.matchMedia('(max-width: 1024px)');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );

  return candidates.filter((el) => {
    if (el.hasAttribute('disabled')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

export function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-mobile-nav-toggle]');
  const overlay = document.querySelector<HTMLElement>('[data-mobile-nav-overlay]');
  const drawer = document.getElementById('mobile-nav-drawer');
  const closeButton = drawer?.querySelector<HTMLButtonElement>('[data-mobile-nav-close]') ?? null;

  if (!toggle || !overlay || !drawer || !closeButton) return;

  const navLinks = Array.from(drawer.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));

  let isOpen = false;
  let scrollY = 0;
  let lastActiveElement: HTMLElement | null = null;

  const onKeyDown = (event: KeyboardEvent): void => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusableElements(drawer);
    if (!focusable.length) {
      event.preventDefault();
      closeButton.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (!active || !drawer.contains(active)) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const lockScroll = (): void => {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
  };

  const unlockScroll = (restorePosition: boolean): void => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    if (restorePosition) {
      window.scrollTo(0, scrollY);
    }
    getLenis()?.start();
  };

  const open = (): void => {
    if (isOpen || !MOBILE_BREAKPOINT_QUERY.matches) return;

    isOpen = true;
    lastActiveElement = document.activeElement as HTMLElement | null;

    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    overlay.setAttribute('aria-hidden', 'false');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.removeAttribute('inert');

    document.documentElement.classList.add('mobile-nav-open');
    document.body.classList.add('mobile-nav-open');

    lockScroll();
    document.addEventListener('keydown', onKeyDown);

    requestAnimationFrame(() => {
      closeButton.focus();
    });
  };

  const close = (options: { restoreScroll?: boolean; returnFocus?: boolean } = {}): void => {
    if (!isOpen) return;

    const { restoreScroll = true, returnFocus = true } = options;

    isOpen = false;

    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    overlay.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');

    document.documentElement.classList.remove('mobile-nav-open');
    document.body.classList.remove('mobile-nav-open');

    unlockScroll(restoreScroll);
    document.removeEventListener('keydown', onKeyDown);

    if (returnFocus) {
      if (lastActiveElement) {
        lastActiveElement.focus();
      } else {
        toggle.focus();
      }
    }
  };

  const handleViewportChange = (): void => {
    if (!MOBILE_BREAKPOINT_QUERY.matches) {
      close();
    }
  };

  toggle.addEventListener('click', () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  closeButton.addEventListener('click', () => close());
  overlay.addEventListener('click', () => close());

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      close({ restoreScroll: false, returnFocus: false });
    });
  });

  if (typeof MOBILE_BREAKPOINT_QUERY.addEventListener === 'function') {
    MOBILE_BREAKPOINT_QUERY.addEventListener('change', handleViewportChange);
  } else {
    MOBILE_BREAKPOINT_QUERY.addListener(handleViewportChange);
  }
}
