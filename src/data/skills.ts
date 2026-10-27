export type SkillIcon = {
  slug: string
  /** Hex used on the dark marquee strip. */
  onDark: string
  /** Hex used on the light skills cards. */
  onLight: string
}

export type Skill = {
  name: string
  group: 'Frontend' | 'Backend and data' | 'AI and automation'
  icon?: SkillIcon
  symbol?: string
}

/**
 * Single source of truth for Ugo's skills.
 * Order matters: the home page marquee renders this list in order.
 * Only technologies Ugo has confirmed are listed here.
 */
export const SKILLS: Skill[] = [
  {
    name: 'JavaScript',
    group: 'Frontend',
    icon: { slug: 'javascript', onDark: 'F7DF1E', onLight: 'F7DF1E' },
  },
  {
    name: 'TypeScript',
    group: 'Frontend',
    icon: { slug: 'typescript', onDark: '3178C6', onLight: '3178C6' },
  },
  {
    name: 'React',
    group: 'Frontend',
    icon: { slug: 'react', onDark: '61DAFB', onLight: '61DAFB' },
  },
  {
    name: 'Next.js',
    group: 'Frontend',
    icon: { slug: 'nextdotjs', onDark: 'FFFFFF', onLight: '111111' },
  },
  {
    name: 'Node.js',
    group: 'Backend and data',
    icon: { slug: 'nodedotjs', onDark: '5FA04E', onLight: '5FA04E' },
  },
  {
    name: 'Python',
    group: 'Backend and data',
    icon: { slug: 'python', onDark: '3776AB', onLight: '3776AB' },
  },
  {
    name: 'FastAPI',
    group: 'Backend and data',
    icon: { slug: 'fastapi', onDark: '009688', onLight: '009688' },
  },
  {
    name: 'Django',
    group: 'Backend and data',
    icon: { slug: 'django', onDark: '44B78B', onLight: '44B78B' },
  },
  {
    name: 'PostgreSQL',
    group: 'Backend and data',
    icon: { slug: 'postgresql', onDark: '4169E1', onLight: '4169E1' },
  },
  {
    name: 'Supabase',
    group: 'Backend and data',
    icon: { slug: 'supabase', onDark: '3FCF8E', onLight: '3FCF8E' },
  },
  {
    name: 'AI / LLMs',
    group: 'AI and automation',
    symbol: '✳',
  },
  {
    name: 'Automation',
    group: 'AI and automation',
    symbol: '⑂',
  },
  {
    name: 'Tailwind CSS',
    group: 'Frontend',
    icon: { slug: 'tailwindcss', onDark: '06B6D4', onLight: '06B6D4' },
  },
]

const GROUP_ORDER = ['Frontend', 'Backend and data', 'AI and automation'] as const

/** The same skills, grouped for the Skills section cards. */
export const SKILL_GROUPS = GROUP_ORDER.map((title) => ({
  title,
  skills: SKILLS.filter((skill) => skill.group === title),
})).filter((group) => group.skills.length > 0)
