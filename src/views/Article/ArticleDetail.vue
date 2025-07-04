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
                  <img v-if="themeStore.currentTheme == 'light'" src="@/assets/images/Like.svg" />
                  <img v-else src="@/assets/images/LikeWhite.svg" />
                  <span>0</span>
                </n-icon>
                <n-icon>
                  <img v-if="themeStore.currentTheme == 'light'" src="@/assets/images/View.svg" />
                  <img v-else src="@/assets/images/ViewWhite.svg" />
                  <span>0</span>
                </n-icon>
                <n-icon>
                  <img
                    v-if="themeStore.currentTheme == 'light'"
                    src="@/assets/images/CommentOutlined.svg"
                  />
                  <img v-else src="@/assets/images/CommentWhite.svg" />
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
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, ref, defineEmits } from 'vue'
import { _formatTime } from '@/utils/publickFun'
import QuillView from '@/components/QuillView.vue'
import { useThemeStore } from '@/stores/themeStore'
const themeStore = useThemeStore()
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
