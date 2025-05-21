import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'light' as 'light' | 'dark' | 'system',
  }),
  actions: {
    setTheme(theme: 'light' | 'dark' | 'system') {
      this.currentTheme = theme
    },
  },
  persist: true,
})
