<template>
  <n-config-provider
    style="width: 100%; height: 100%"
    :theme="themeStore.currentTheme == 'light' ? null : darkTheme"
    :locale="naiveLocale"
  >
    <main>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <RouterView />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </main>
  </n-config-provider>
  <n-back-top :right="100" />
</template>

<script setup lang="ts">
import { NMessageProvider, NDialogProvider, darkTheme } from 'naive-ui'
import { zhCN, enUS } from 'naive-ui/lib/locales'
import { useThemeStore } from '@/stores/themeStore'
import { computed } from 'vue'
const { locale } = useI18n()
const themeStore = useThemeStore()

// 根据当前语言返回对应的Naive UI locale
const naiveLocale = computed(() => {
  switch (locale.value) {
    case 'zh-CN':
      return zhCN
    default:
      return enUS
  }
})
</script>

<style scoped lang="scss"></style>
