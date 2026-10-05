/**
 * icons/registry.ts
 * Phase 4 — SVG icon registry for the skills section only.
 *
 * All SVGs use viewBox="0 0 24 24" for consistent 24×24 rendering.
 * All SVGs use currentColor so they inherit the element's text color.
 * All icons are aria-hidden by default when injected; labels always accompany them.
 * Sources: Simple Icons (brand shapes), custom symbolic SVGs for patterns/concepts.
 */

export type IconId =
  | 'csharp'
  | 'oop'
  | 'linq'
  | 'aspnet-mvc'
  | 'aspnet-api'
  | 'efcore'
  | 'dapper'
  | 'signalr'
  | 'sqlserver'
  | 'db-design'
  | 'stored-procedures'
  | 'functions'
  | 'triggers'
  | 'indexing'
  | 'redis'
  | 'onion-arch'
  | 'three-tier'
  | 'repository-pattern'
  | 'unit-of-work'
  | 'dependency-injection'
  | 'git'
  | 'github'
  | 'swagger'
  | 'postman'
  | 'automapper'
  | 'iis'
  | 'html'
  | 'css'
  | 'car'
  | 'receipt'
  | 'bank'
  | 'users'
  | 'heart-pulse'
  | 'calendar'
  | 'clock'
  | 'shopping-cart'
  | 'lock'
  | 'linkedin'
  | 'mail'
  | 'arrow-up-right'
  | 'certificate';

/** Registry: maps icon ID → raw SVG inner content (paths only, no root svg tag). */
const ICON_PATHS: Record<IconId, string> = {

  // ── Brand: C# ──────────────────────────────────────────────────────────────
  csharp: `
    <path d="M11.5 0L1.5 5.75v12.5L11.5 24l10-5.75V5.75L11.5 0zm0 2.3l8 4.6v9.2l-8 4.6-8-4.6V6.9l8-4.6z"
      fill="currentColor"/>
    <path d="M9.3 14.7c-.6-1-.9-2.1-.9-3.2s.3-2.2.9-3.2c.6-1 1.5-1.8 2.6-2.3l.8 1.4c-.8.4-1.5 1-1.9 1.8-.4.8-.6 1.5-.6 2.3s.2 1.6.6 2.3c.4.8 1.1 1.4 1.9 1.8l-.8 1.4c-1.1-.5-2-1.3-2.6-2.3z"
      fill="currentColor"/>
    <path d="M15.5 10.8h-.8V10h-.8v.8h-.8V11.5h.8v.8h.8v-.8h.8V10.8z M17.7 10.8h-.8V10h-.8v.8h-.8V11.5h.8v.8h.8v-.8h.8V10.8z"
      fill="currentColor"/>
  `,

  // ── OOP — cube/structure ───────────────────────────────────────────────────
  oop: `
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M2 17l10 5 10-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M2 7v10M22 7v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── LINQ — funnel/filter ───────────────────────────────────────────────────
  linq: `
    <path d="M3 4h18l-6.5 8v6l-5-2.5V12L3 4z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  `,

  // ── ASP.NET Core MVC — layered windows ────────────────────────────────────
  'aspnet-mvc': `
    <rect x="3" y="5" width="18" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M3 9h18" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 13h3M8 16h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="5.5" cy="7" r=".8" fill="currentColor"/>
    <circle cx="7.5" cy="7" r=".8" fill="currentColor"/>
  `,

  // ── ASP.NET Core Web API — cloud/arrow-up (API endpoint feel) ─────────────
  'aspnet-api': `
    <path d="M12 16V8m0 0-3 3m3-3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 18H5a2 2 0 0 1-2-2v-1a4 4 0 0 1 4-4h.5M17 18h2a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Entity Framework Core — database with lightning ───────────────────────
  efcore: `
    <ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M4 6v4c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" stroke-width="1.5"/>
    <path d="M4 10v4c0 1.66 3.58 3 8 3s8-1.34 8-3v-4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M13 13l-2 3h3l-2 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── Dapper — lightning bolt (fast/micro ORM) ───────────────────────────────
  dapper: `
    <path d="M13 2L4 14h7l-1 8 9-12h-7l2-8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  `,

  // ── SignalR — radio/signal waves ──────────────────────────────────────────
  signalr: `
    <path d="M5.6 5.6A8 8 0 0 0 4 10.5a8 8 0 0 0 2 5.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M18.4 5.6A8 8 0 0 1 20 10.5a8 8 0 0 1-2 5.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M8.5 8.5A4.5 4.5 0 0 0 7 11.5a4.5 4.5 0 0 0 1.3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M15.5 8.5A4.5 4.5 0 0 1 17 11.5a4.5 4.5 0 0 1-1.3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <circle cx="12" cy="11.5" r="1.5" fill="currentColor"/>
    <path d="M12 13v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── SQL Server — database cylinder ────────────────────────────────────────
  sqlserver: `
    <ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" stroke="currentColor" stroke-width="1.5"/>
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" stroke-width="1.5"/>
  `,

  // ── Database Design — ERD-like schema ─────────────────────────────────────
  'db-design': `
    <rect x="2" y="4" width="7" height="4" rx=".5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="15" y="4" width="7" height="4" rx=".5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="8" y="16" width="8" height="4" rx=".5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M9 6h6M12 8.5v5M5.5 8v5l6.5 3M18.5 8v5l-6.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Stored Procedures — curly braces + function ────────────────────────────
  'stored-procedures': `
    <path d="M8 4C6 4 5 5 5 7v3c0 1.5-1 2-2 2 1 0 2 .5 2 2v3c0 2 1 3 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M16 4c2 0 3 1 3 3v3c0 1.5 1 2 2 2-1 0-2 .5-2 2v3c0 2-1 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M9 12h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Functions — math lambda / ƒ ────────────────────────────────────────────
  functions: `
    <path d="M6 4a2 2 0 0 1 2-2 2 2 0 0 1 2 2c0 5-3 6-3 10h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M9.5 14H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Triggers — lightning strike ────────────────────────────────────────────
  triggers: `
    <path d="M14 2 L8 13h5l-3 9 9-11h-5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  `,

  // ── Indexing — search/magnifier + plus ─────────────────────────────────────
  indexing: `
    <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M15 15l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10 7v6M7 10h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Redis — Simple Icons Redis shape (cloud-bolt) ─────────────────────────
  redis: `
    <path d="M2 10c0-4 3.5-7 8-7 2.4 0 4.6.9 6.2 2.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M22 14c0 4-3.5 7-8 7-2.4 0-4.6-.9-6.2-2.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M11 7l-3 5h5l-3 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── Onion Architecture — concentric circles (layers) ──────────────────────
  'onion-arch': `
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,

  // ── 3-Tier Architecture — stacked horizontal bars ─────────────────────────
  'three-tier': `
    <rect x="3" y="4" width="18" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="3" y="10" width="18" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="3" y="16" width="18" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
  `,

  // ── Repository Pattern — git-branch / layers ─────────────────────────────
  'repository-pattern': `
    <circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="6" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="18" cy="10" r="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M6 8v8M6 8c0 2 12 4 12 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Unit of Work — git commit / intersect ────────────────────────────────
  'unit-of-work': `
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M2 12h7M15 12h7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M7 5l5 7-5 7M17 5l-5 7 5 7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── Dependency Injection — plug/share-network ─────────────────────────────
  'dependency-injection': `
    <path d="M10 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M14 4h6v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M20 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,

  // ── Git — Simple Icons Git shape ──────────────────────────────────────────
  git: `
    <path d="M22.2 11.2l-9.4-9.4a1.1 1.1 0 0 0-1.6 0L9 4l2 2a1.3 1.3 0 0 1 1.7 1.7l2 2a1.3 1.3 0 0 1 1.4 2.1 1.3 1.3 0 0 1-1.8 0 1.3 1.3 0 0 1 0-1.8l-1.9-1.9v4.9a1.3 1.3 0 0 1 .4 2.2 1.3 1.3 0 0 1-1.8-1.8 1.3 1.3 0 0 1 .8-.4V8.7a1.3 1.3 0 0 1-.8-.4 1.3 1.3 0 0 1 0-1.8L9.1 4.6 1.8 11.9a1.1 1.1 0 0 0 0 1.6l9.4 9.4a1.1 1.1 0 0 0 1.6 0l9.4-9.4a1.1 1.1 0 0 0-.1-2.3z" fill="currentColor"/>
  `,

  // ── GitHub — Simple Icons GitHub mark ────────────────────────────────────
  github: `
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.89 1.52 2.33 1.08 2.9.83.09-.65.35-1.08.63-1.33-2.2-.25-4.52-1.1-4.52-4.9 0-1.08.39-1.97 1.02-2.66-.1-.25-.44-1.26.1-2.63 0 0 .83-.27 2.73 1.02A9.47 9.47 0 0 1 12 6.8c.84 0 1.69.11 2.48.33 1.9-1.29 2.73-1.02 2.73-1.02.54 1.37.2 2.38.1 2.63.63.7 1.02 1.58 1.02 2.66 0 3.81-2.33 4.65-4.55 4.9.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" fill="currentColor"/>
  `,

  // ── Swagger — simple shield-check / OpenAPI feel ─────────────────────────
  swagger: `
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <path d="M12 16v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="19.5" r=".75" fill="currentColor"/>
  `,

  // ── Postman — send / paper-plane ─────────────────────────────────────────
  postman: `
    <path d="M22 2L11 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M22 2l-7 20-4-9-9-4 20-7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  `,

  // ── AutoMapper — arrows-right-left (map / transform) ─────────────────────
  automapper: `
    <path d="M5 8h14M5 8l3-3M5 8l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19 16H5M19 16l-3-3M19 16l-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── IIS — server rack ────────────────────────────────────────────────────
  iis: `
    <rect x="2" y="3" width="20" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="2" y="10" width="20" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="2" y="17" width="20" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="18" cy="5.5" r="1" fill="currentColor"/>
    <circle cx="18" cy="12.5" r="1" fill="currentColor"/>
  `,

  // ── HTML — angle brackets / code ─────────────────────────────────────────
  html: `
    <path d="M5 3l-1 16 8 2 8-2-1-16H5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8 8h8M8.5 12h7l-.5 4-3.5 1-3.5-1-.2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── CSS — style bracket ───────────────────────────────────────────────────
  css: `
    <path d="M5 3l-1 16 8 2 8-2-1-16H5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8 8h8M8 12h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M9 16l3 1 3-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // ── Projects Phase Icons ──────────────────────────────────────────────────
  car: `
    <path d="M5 10l1.5-4.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L19 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 10h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="7" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="17" cy="14" r="1.5" fill="currentColor"/>
  `,
  receipt: `
    <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8 6h8M8 10h8M8 14h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,
  bank: `
    <path d="M12 2L2 7h20L12 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M4 18V9M8 18V9M12 18V9M16 18V9M20 18V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M2 18h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M2 22h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,
  users: `
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  'heart-pulse': `
    <path d="M19.5 7.1A5.3 5.3 0 0 0 12 6.5a5.3 5.3 0 0 0-7.5.6c-2 2-2 5.1 0 7l7.5 7.5 7.5-7.5c2-2 2-5 0-7z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 12h5l2.5-4 3 8 2.5-4h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  calendar: `
    <rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  `,
  clock: `
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  'shopping-cart': `
    <circle cx="9" cy="21" r="1" fill="currentColor"/>
    <circle cx="20" cy="21" r="1" fill="currentColor"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  lock: `
    <rect x="5" y="11" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  certificate: `
    <circle cx="12" cy="8" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 11.5l-2.5 10 3.5-2 3 2.5 3-2.5 3.5 2-2.5-10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  linkedin: `
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="2" y="9" width="4" height="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  mail: `
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  'arrow-up-right': `
    <line x1="7" y1="17" x2="17" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="7 7 17 7 17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `,
};

/**
 * Returns a full <svg> element string for the given icon ID.
 * Safe to inject as innerHTML into a skill card icon slot.
 */
export function getIcon(id: IconId, size = 24, className?: string): string {
  const paths = ICON_PATHS[id];
  if (!paths) return '';
  const cssClass = className ? className : 'skill-card__icon-svg';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" aria-hidden="true" focusable="false" class="${cssClass}">${paths}</svg>`;
}
