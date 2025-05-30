<template>
  <main>
    <n-message-provider>
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-message-provider>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NDialogProvider } from 'naive-ui'
</script>

<style scoped lang="scss"></style>
