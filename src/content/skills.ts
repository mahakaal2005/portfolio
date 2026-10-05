/**
 * Skills.
 *
 * `level` is 0–1 and is never displayed. It orders each group strongest first
 * and decides which entries take the emphasised treatment (>= 0.85), so the
 * hierarchy is derived rather than hand-maintained.
 *
 * Printed percentages were removed deliberately: a self-assigned number has no
 * shared scale, nobody rates themselves low, and the values collapse into a
 * narrow band that distinguishes nothing. Keep the values honest anyway — they
 * still decide what gets highlighted.
 *
 * Note: the *visible* skills section is ui/SkillsCards.tsx, which carries its
 * own icon-per-skill list. This file feeds the alternative `Skills()` layout in
 * ui/Sections.tsx, which is not currently rendered — keep the two in step if
 * you ever switch between them.
 */
export interface Skill {
  name: string
  level: number
  /** Optional — years of use. */
  years?: number
}

export interface SkillGroup {
  id: string
  label: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'android',
    label: 'Android',
    skills: [
      { name: 'Kotlin', level: 0.93 },
      { name: 'Jetpack Compose', level: 0.92 },
      { name: 'Material Design 3', level: 0.87 },
      { name: 'Coroutines & Flow', level: 0.86 },
      { name: 'Room & DataStore', level: 0.84 },
      { name: 'ML Kit', level: 0.72 },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    skills: [
      { name: 'Clean Architecture', level: 0.9 },
      { name: 'MVI', level: 0.88 },
      { name: 'MVVM', level: 0.87 },
      { name: 'Repository pattern', level: 0.85 },
      { name: 'Koin', level: 0.84 },
      { name: 'Hilt', level: 0.74 },
    ],
  },
  {
    id: 'languages',
    label: 'Languages & Web',
    skills: [
      { name: 'Java', level: 0.86 },
      { name: 'Data structures & algorithms', level: 0.85 },
      { name: 'JavaScript', level: 0.78 },
      { name: 'React', level: 0.75 },
      { name: 'Node.js & Express', level: 0.74 },
      { name: 'Ktor', level: 0.8 },
    ],
  },
  {
    id: 'data-tools',
    label: 'Data & Tools',
    skills: [
      { name: 'Git & GitHub', level: 0.88 },
      { name: 'Android Studio', level: 0.88 },
      { name: 'PostgreSQL', level: 0.8 },
      { name: 'Firebase', level: 0.78 },
      { name: 'MongoDB', level: 0.72 },
      { name: 'Gradle KTS', level: 0.8 },
      { name: 'Linux', level: 0.76 },
    ],
  },
]
