<template>
  <n-modal-provider>
    <n-modal v-model:show="showModalRef">
      <n-card
        style="width: 80%"
        title="编辑博客文章"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <ModifyArticle :data="props.editData" @canleEdit="canleEdit"></ModifyArticle>
      </n-card>
    </n-modal>
  </n-modal-provider>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import ModifyArticle from './ModifyArticle.vue'

const emit = defineEmits<{
  (e: 'update:showModal', val: boolean): void
}>()
const props = defineProps<{
  showModal: boolean
  editData: object
}>()

const showModalRef = ref(false)

// 取消
const canleEdit = () => {
  showModalRef.value = false
}

watch(
  () => props.showModal,
  (val) => {
    showModalRef.value = val
  },
  { immediate: true },
)

watch(showModalRef, (val) => {
  emit('update:showModal', val)
})
</script>
