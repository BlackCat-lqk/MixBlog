import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'
export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: (localStorage.getItem('app-theme') as Theme) || 'dark',
  }),
  actions: {
    setTheme(theme: Theme) {
      this.currentTheme = theme
      localStorage.setItem('app-theme', theme)
      // 同步到根DOM中
      document.documentElement.setAttribute('data-theme', theme)
    },
  },
})
