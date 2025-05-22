import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: (localStorage.getItem('selectedTheme') || 'light') as 'light' | 'dark' | 'system',
  }),
  actions: {
    setTheme(theme: 'light' | 'dark' | 'system') {
      this.currentTheme = theme
    },
  },
  persist: {
    storage: {
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
    },
  },
})
