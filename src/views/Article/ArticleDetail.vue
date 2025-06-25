<template>
  <div id="article-detail-drawer-box">
    <n-drawer
      v-model:show="activeDrawer"
      placement="bottom"
      style="height: 98%; border-radius: 10px 10px 0 0;"
    >
      <n-drawer-content closable>
        <template #header>
          <div>
            <div>
              {{ props.data.title }}
            </div>
            <div>
              <div><span>{{ props.data.category }}{{ props.data.tags }}</span><p>{{ _formatTime(props.data.updatedAt) }}</p></div>
              <div>喜欢</div>
            </div>
          </div>

        </template>
        <div>
          <div>{{ props.data.intro }}</div>
          <div>{{ props.data.content }}</div>
        </div>

      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, ref, defineEmits } from 'vue'
import { _formatTime } from '@/utils/publickFun'

const activeDrawer = ref(false)
const emits = defineEmits(['update:showModal'])
interface articleDetailType {
  title: string
  content: string
  intro: string
  category: string
  updatedAt: string
  tags: string[]
}

const props = defineProps({
  data: {
    type: Object as () => articleDetailType,
    required: true,
  },
  showModal: {
    type: Boolean,
    default: false,
  },
})

watch(() => props.showModal, (newVal) => {
  if (newVal) {
    activeDrawer.value = true
  }
})

watch(() => activeDrawer.value, (newVal) => {
  if (newVal) {
    emits('update:showModal', false)
  }
})
</script>

<style scoped lang="scss">
.article-menu-box {
  min-width: 1240px;
  max-width: 1480px;
  margin-top: 2vh;
  flex: 1;
  .more-btn {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
  :deep(.n-drawer--bottom-placement) {
    height: 100%;
  }
}
</style>
