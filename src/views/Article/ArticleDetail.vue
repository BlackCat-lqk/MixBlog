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
          <div class="article-header-box">
            <div class="article-header-title">
              <h3>{{ props.data.title }}</h3>
            </div>
            <div class="article-header-info-box">
              <div class="article-header-info">
                <n-tag :bordered="false">{{ props.data.category }}</n-tag>
                <n-tag
                  v-for="(tag, idx) in props.data.tags"
                  :key="idx"
                  type="info"
                  round
                  :bordered="false"
                  >{{ tag }}</n-tag
                >
                <p>{{ _formatTime(props.data.updatedAt) }}</p>
              </div>
              <div class="article-header-data-info">
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
        <div class="article-content-box">
          <div class="article-intro">
            <p>{{ props.data.intro }}</p>
          </div>
          <div class="article-content">
            <div class="article-content-inner">
              <quill-view :content="props.data.content"></quill-view>
            </div>
          </div>
          <div v-if="!showComment" class="article-comment-float" @click="showComment = true">
            <img width="40px" src="@/assets/images/commentFloat.svg" />
          </div>
          <div v-else class="article-comment-area">
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
import QuillView from '@/components/QuillView.vue'
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
:deep(.ql-toolbar) {
  display: none;
}
:deep(.ql-container) {
  border: none;
}

body {
  .article-header-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    .article-header-title {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
      color: var(--sub-text-color);
    }
    .article-header-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .article-header-info {
        display: flex;
        padding: 16px 0 20px 0;
        align-items: center;
        gap: 10px;
        p {
          font-size: 14px;
          color: var(--sub-text-color);
        }
      }
      .article-header-data-info {
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
  .article-content-box {
    max-width: 1264px;
    min-width: 1040px;
    padding: 0 120px;
    position: relative;
    .article-comment-float {
      position: fixed;
      top: 50%;
      right: 0%;
      max-width: 1264px;
      min-width: 1040px;
      transform: translate(35%, 0%);
    }
    .article-comment-area {
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
    .article-intro {
      background-color: var(--box-bg-color5);
      padding: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      p {
        font-size: 18px;
        line-height: 1.54;
        text-align: center;
        color: var(--text-color);
      }
    }
    .article-content {
      padding-top: 40px;
      display: flex;
      justify-content: center;
      .article-content-inner {
        width: 800px;
        p {
          font-size: 18px;
          line-height: 1.54;
          color: var(--text-color);
        }
      }
    }
  }
}
</style>
