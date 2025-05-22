import { defineStore } from "pinia";

export const useGlobalSearchStore = defineStore("globalSearch", {
  state: () => ({
    search: [] as Array<string>,
  }),
  actions: {
    setSearch(value: string) {
      if(this.search.length >= 5){
        this.search.pop();
      }
      this.search.unshift(value);
    },
  },
  persist:true,
});
