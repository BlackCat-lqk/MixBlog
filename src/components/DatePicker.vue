<template>
  <n-date-picker
    v-model:value="range"
    type="daterange"
    :shortcuts="rangeShortcuts"
    @update:value="confirm"
    clearable
    input-readonly
  >
    <template #date-icon>
      <div></div>
    </template>
  </n-date-picker>
</template>

<script setup lang="ts">
const emits = defineEmits(['updateDate'])
const range = ref(null)
const rangeShortcuts = {
  一周内: () => {
    const cur = new Date().getTime()
    return [cur - 7 * 24 * 60 * 60 * 1000, cur] as const
  },
  一个月内: () => {
    const cur = new Date().getTime()
    return [cur - 30 * 24 * 60 * 60 * 1000, cur] as const
  },
  三个月内: () => {
    const cur = new Date().getTime()
    return [cur - 90 * 24 * 60 * 60 * 1000, cur] as const
  },
  半年内: () => {
    const cur = new Date().getTime()
    return [cur - 180 * 24 * 60 * 60 * 1000, cur] as const
  },
  一年内: () => {
    const cur = new Date().getTime()
    return [cur - 365 * 24 * 60 * 60 * 1000, cur] as const
  },
}
const confirm = () => {
  emits('updateDate', range.value)
}
</script>
