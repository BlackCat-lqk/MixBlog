<template>
  <n-result status="404" :title="$t('notFound.title')" :description="$t('notFound.content')">
    <template #footer>
      <n-button @click="$router.push('/')">{{ $t('notFound.back') }}</n-button>
    </template>
  </n-result>
</template>
