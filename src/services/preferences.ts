export function getThemePreference(): string {
  try {
    return localStorage.getItem('theme') || 'dark'
  } catch {
    return 'dark'
  }
}

export function setThemePreference(theme: string): void {
  try {
    localStorage.setItem('theme', theme)
  } catch {}
}
