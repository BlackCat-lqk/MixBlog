<template>
  <n-modal-provider>
    <n-modal v-model:show="showModalRef">
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
const emit = defineEmits<{
  (e: 'update:showModal', val: boolean): void
}>()
const props = defineProps<{
  showModal: boolean
}>()

const showModalRef = ref(false)

watch(
  () => props.showModal,
  (val) => {
    if (val) {
      showModalRef.value = val
    }
  },
)

watch(
  () => showModalRef.value,
  (val) => {
    if (!val) {
      emit('update:showModal', val)
    }
  },
)
</script>

<style lang="scss" scoped></style>
