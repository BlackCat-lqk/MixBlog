<template>
  <div>
    <n-drawer
      v-model:show="activeDrawer"
      placement="bottom"
      style="height: 98%; border-radius: 10px 10px 0 0"
      to="body"
    >
      <n-drawer-content closable>
        <template #header>
          <div class="image-header-box">
            <div class="image-header-title">
              <h3>{{ props.data.title }}</h3>
            </div>
            <div class="image-header-info-box">
              <div class="image-header-info">
                <n-tag :bordered="false" type="info">{{ props.data.category }}</n-tag>
                <p>{{ _formatTime(props.data.updatedAt) }}</p>
              </div>
              <div class="image-header-data-info">
                <n-icon>
                  <img width="20px" src="@/assets/images/likes.svg" />
                  <span>0</span>
                </n-icon>
                <n-icon>
                  <img width="20px" src="@/assets/images/views.svg" />
                  <span>0</span>
                </n-icon>
                <n-icon>
                  <img width="20px" src="@/assets/images/comment.svg" />
                  <span>0</span>
                </n-icon>
              </div>
            </div>
          </div>
        </template>
        <div class="image-content-box">
          <div class="image-intro">
            <p>{{ props.data.content }}</p>
          </div>
          <div class="image-content">
            <div class="image-content-inner">
              <n-image
                v-for="(item, idx) in props.data.photos"
                :key="idx"
                :src="item"
                object-fit="cover"
                width="100%"
              />
            </div>
          </div>
          <div v-if="!showComment" class="image-comment-float" @click="showComment = true">
            <img width="40px" src="@/assets/images/commentFloat.svg" />
          </div>
          <div v-else class="image-comment-area">
            <img width="20px" src="@/assets/images/close1.svg" @click="showComment = false" />
          </div>
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
  category: string
  updatedAt: string
  photos: string[]
}

const showComment = ref(false)

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

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      activeDrawer.value = true
    }
  },
)

watch(
  () => activeDrawer.value,
  (newVal) => {
    if (newVal) {
      emits('update:showModal', false)
    }
  },
)
</script>

<style scoped lang="scss">
:deep(.n-drawer-header__main) {
  display: flex;
  justify-content: center;
}
:deep(.n-drawer-body-content-wrapper) {
  display: flex;
  justify-content: center;
  @include g.scrollbarCustom;
}
body {
  .image-header-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    .image-header-title {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
    }
    .image-header-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .image-header-info {
        display: flex;
        padding: 16px 0 20px 0;
        align-items: center;
        gap: 10px;
        p {
          font-size: 14px;
          color: var(--sub-text-color);
        }
      }
      .image-header-data-info {
        display: flex;
        gap: 24px;
        .n-icon {
          display: flex;
          gap: 2px;
          span {
            font-size: 14px;
            color: var(--sub-text-color);
          }
        }
      }
    }
  }
  .image-content-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    position: relative;
    .image-comment-float {
      position: fixed;
      top: 50%;
      right: 0%;
      max-width: 1264px;
      min-width: 1040px;
      transform: translate(60%, 0%);
    }
    .image-comment-area {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 0%);
      max-width: 1264px;
      min-width: 1040px;
      height: 500px;
      border-radius: 8px;
      background-color: var(--box-bg-color5);
      color: var(--text-color);
    }
    .image-intro {
      background-color: var(--box-bg-color1);
      padding: 32px;
      display: flex;
      justify-content: center;
      border-radius: 8px;
      p {
        font-size: 18px;
        line-height: 1.54;
        color: var(--text-color);
      }
    }
    .image-content {
      padding-top: 40px;
      display: flex;
      justify-content: center;
      .image-content-inner {
        width: 800px;
        :deep(.n-image) {
          width: 100%;
          object-fit: cover;
          border-radius: 8px;
          margin: 20px 0;
        }
        p {
          font-size: 18px;
          line-height: 1.54;
          color: #0b1926;
        }
      }
    }
  }
}
</style>
