/**
 * scripts/projects.ts
 * Phase 5 — Projects section: inline icon injection & minimal enhancements.
 *
 * Responsibilities:
 *  1. Inject project-specific SVG icons from the registry based on data attributes.
 *
 * This module is phase-constrained. No global observers or global logic.
 */

import { getIcon, IconId } from '../icons/registry';

/** Inject SVGs into any element with [data-icon] inside projects/training sections. */
export function initProjects(): void {
  // Find all elements marked for an icon
  const iconContainers = document.querySelectorAll<HTMLElement>('[data-icon]');
  
  iconContainers.forEach((container) => {
    const iconId = container.getAttribute('data-icon') as IconId | null;
    if (iconId) {
      // Small helper to optionally inject classes or just use defaults
      // e.g. for tech stack badges, maybe we pass a modifier class if needed
      const cssClass = container.getAttribute('data-icon-class') || '';
      const size = parseInt(container.getAttribute('data-icon-size') || '20', 10);
      
      container.innerHTML = getIcon(iconId, size, cssClass);
    }
  });
}
