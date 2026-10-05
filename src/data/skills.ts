/**
 * data/skills.ts
 * Phase 4 — Skills data source.
 *
 * Single source of truth for all skills rendered in the skills section.
 * Grouped into four meaningful categories matching the approved blueprint.
 */

import type { IconId } from '../icons/registry';

export interface Skill {
  id: string;
  label: string;
  icon: IconId;
  /** Optional: wider card in the grid (architecture/pattern cards span 2 cols) */
  wide?: boolean;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'core-backend',
    label: 'Core Backend',
    skills: [
      { id: 'csharp',      label: 'C#',                     icon: 'csharp'      },
      { id: 'oop',         label: 'OOP',                    icon: 'oop'         },
      { id: 'linq',        label: 'LINQ',                   icon: 'linq'        },
      { id: 'aspnet-mvc',  label: 'ASP.NET Core MVC',       icon: 'aspnet-mvc'  },
      { id: 'aspnet-api',  label: 'ASP.NET Core Web API',   icon: 'aspnet-api'  },
      { id: 'efcore',      label: 'Entity Framework Core',  icon: 'efcore'      },
      { id: 'dapper',      label: 'Dapper',                 icon: 'dapper'      },
      { id: 'signalr',     label: 'SignalR',                icon: 'signalr'     },
    ],
  },
  {
    id: 'database',
    label: 'Database & Data',
    skills: [
      { id: 'sqlserver',          label: 'SQL Server',         icon: 'sqlserver'         },
      { id: 'db-design',          label: 'Database Design',    icon: 'db-design'         },
      { id: 'stored-procedures',  label: 'Stored Procedures',  icon: 'stored-procedures' },
      { id: 'functions',          label: 'Functions',          icon: 'functions'         },
      { id: 'triggers',           label: 'Triggers',           icon: 'triggers'          },
      { id: 'indexing',           label: 'Indexing',           icon: 'indexing'          },
      { id: 'redis',              label: 'Redis',              icon: 'redis'             },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture & Patterns',
    skills: [
      { id: 'onion-arch',           label: 'Onion Architecture',  icon: 'onion-arch',           wide: true },
      { id: 'three-tier',           label: '3-Tier Architecture', icon: 'three-tier',           wide: true },
      { id: 'repository-pattern',   label: 'Repository Pattern',  icon: 'repository-pattern',   wide: true },
      { id: 'unit-of-work',         label: 'Unit of Work',        icon: 'unit-of-work',         wide: true },
      { id: 'dependency-injection', label: 'Dependency Injection',icon: 'dependency-injection', wide: true },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Delivery',
    skills: [
      { id: 'git',        label: 'Git',        icon: 'git'        },
      { id: 'github',     label: 'GitHub',     icon: 'github'     },
      { id: 'swagger',    label: 'Swagger',    icon: 'swagger'    },
      { id: 'postman',    label: 'Postman',    icon: 'postman'    },
      { id: 'automapper', label: 'AutoMapper', icon: 'automapper' },
      { id: 'iis',        label: 'IIS',        icon: 'iis'        },
      { id: 'html',       label: 'HTML',       icon: 'html'       },
      { id: 'css',        label: 'CSS',        icon: 'css'        },
    ],
  },
];
