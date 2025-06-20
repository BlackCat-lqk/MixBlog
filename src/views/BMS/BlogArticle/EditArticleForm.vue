<template>
  <n-modal-provider>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="编辑博客文章"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        内容
        <template #footer>
          <n-button strong secondary>取消</n-button>
          <n-button type="info">确认</n-button>
        </template>
      </n-card>
    </n-modal>
  </n-modal-provider>

</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped></style>
