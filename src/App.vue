<template>
  <main>
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped lang="scss"></style>
