<template>
  <n-config-provider
    style="width: 100%; height: 100%"
    :theme="themeStore.currentTheme == 'light' ? null : darkTheme"
  >
    <main>
      <n-message-provider>
        <n-dialog-provider>
          <RouterView />
        </n-dialog-provider>
      </n-message-provider>
    </main>
  </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NDialogProvider, darkTheme } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()
</script>

<style scoped lang="scss"></style>
