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
            <n-loading-bar-provider>
              <RouterView />
            </n-loading-bar-provider>
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </main>
  </n-config-provider>
  <n-back-top :right="100" />
  <FeedBack
      :positionBottom="100"
      :positionRight="100"
      title="帮助我们改进"
      api-url="/api/feedback"
    />
</template>

<script setup lang="ts">
import { NMessageProvider, NDialogProvider, darkTheme } from 'naive-ui'
import { zhCN, enUS } from 'naive-ui/lib/locales'
import { useThemeStore } from '@/stores/themeStore'
import { computed } from 'vue'
import FeedBack from '@/components/FeedBack.vue'
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

<style scoped lang="scss">
</style>
