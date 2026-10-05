/**
 * scripts/skills.ts
 * Phase 4 — Skills section: render from data + reveal + hover behavior.
 *
 * Responsibilities:
 *  1. Build skills DOM from SKILL_CATEGORIES data
 *  2. Inject icon SVG per skill card via the icon registry
 *  3. Stagger-reveal cards when the section enters the viewport (IntersectionObserver)
 *  4. Lightweight hover lift is handled purely in CSS (skills.css)
 *
 * This module is skills-only. No global observer system. No project or nav logic.
 */

import { SKILL_CATEGORIES } from '../data/skills';
import { getIcon } from '../icons/registry';

const REVEAL_THRESHOLD = 0.08;
const STAGGER_MS = 38;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Build a single skill card element. */
function buildSkillCard(skill: { id: string; label: string; icon: string; wide?: boolean }, globalIndex: number): HTMLElement {
  const card = document.createElement('article');
  card.className = 'skill-card' + (skill.wide ? ' skill-card--wide' : '');
  card.setAttribute('data-skill', skill.id);
  card.setAttribute('data-reveal-index', String(globalIndex));

  // Icon slot
  const iconEl = document.createElement('div');
  iconEl.className = 'skill-card__icon';
  iconEl.innerHTML = getIcon(skill.icon as Parameters<typeof getIcon>[0], 24);

  // Label
  const labelEl = document.createElement('span');
  labelEl.className = 'skill-card__label';
  labelEl.textContent = skill.label;

  card.appendChild(iconEl);
  card.appendChild(labelEl);

  return card;
}

/** Build one category panel (heading + card grid). */
function buildCategoryPanel(category: typeof SKILL_CATEGORIES[number], cardOffset: number): { el: HTMLElement; count: number } {
  const panel = document.createElement('div');
  panel.className = 'skills__category';
  panel.setAttribute('data-category', category.id);

  const heading = document.createElement('h3');
  heading.className = 'skills__category-label';
  heading.textContent = category.label;
  panel.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'skills__grid';
  panel.appendChild(grid);

  category.skills.forEach((skill, i) => {
    grid.appendChild(buildSkillCard(skill, cardOffset + i));
  });

  return { el: panel, count: category.skills.length };
}

/** Attach reveal observer — skills section only. */
function attachRevealObserver(section: HTMLElement): void {
  const cards = Array.from(section.querySelectorAll<HTMLElement>('.skill-card'));

  if (REDUCED_MOTION) {
    cards.forEach((card) => {
      card.style.removeProperty('opacity');
      card.style.removeProperty('transform');
      card.style.removeProperty('transition');
    });
    return;
  }

  // Prepare initial hidden state via inline style (avoids FOUC with CSS-only approach)
  cards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        revealCards(cards);
      });
    },
    { threshold: REVEAL_THRESHOLD }
  );

  observer.observe(section);
}

/** Stagger-reveal all cards in order. */
function revealCards(cards: HTMLElement[]): void {
  cards.forEach((card, i) => {
    const delay = i * STAGGER_MS;
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s cubic-bezier(0.25,0,0,1), transform 0.5s cubic-bezier(0.25,0,0,1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, delay);
  });
}

/** Main entry point — replaces placeholder HTML inside #skills with data-driven markup. */
export function initSkills(): void {
  const section = document.getElementById('skills');
  if (!section) return;

  // Remove placeholder content, keep section label + heading
  const placeholder = section.querySelector('.skills__placeholder-grid');
  const note = section.querySelector('.skills__note');
  placeholder?.remove();
  note?.remove();

  // Build the constellation container
  const container = section.querySelector('.container');
  if (!container) return;

  const constellation = document.createElement('div');
  constellation.className = 'skills__constellation';
  constellation.setAttribute('aria-label', 'Technical skills grouped by category');

  let cardOffset = 0;
  SKILL_CATEGORIES.forEach((category) => {
    const { el, count } = buildCategoryPanel(category, cardOffset);
    constellation.appendChild(el);
    cardOffset += count;
  });

  container.appendChild(constellation);

  // Attach IntersectionObserver for skills-only reveal
  attachRevealObserver(section);
}
