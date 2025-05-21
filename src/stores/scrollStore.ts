import { defineStore } from 'pinia'

export const useScrollStore = defineStore('scroll', {
  state: () => ({
    targetId: null as string | null,
  }),
  actions: {
    scrollTo(id: string) {
      this.targetId = id
    },
  },
})
