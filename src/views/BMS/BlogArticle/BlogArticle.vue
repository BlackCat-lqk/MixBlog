<template>
  <div class="bms-main-box">
    <div class="header-box">
      <header-view></header-view>
    </div>
    <div class="content-box">
      <div class="sidebar-box">
        <naviga-menu></naviga-menu>
      </div>
      <div class="main-router-box">
        <header-detail :data="headerData"></header-detail>
        <div style="padding: 20px 0">
          <classify-manage
            @getCategoryTags="getCategoryTags"
            :isUpdateTag="state.updateTagCount"
          ></classify-manage>
        </div>
        <div class="list-tag-box">
          <n-list hoverable clickable>
            <n-list-item v-for="(item, idx) in state.articleData" :key="idx">
              <div class="list-content">
                <img
                  class="cover-img"
                  :src="item?.cover ? item?.cover : '@/assets/wallpaper/about.jpg'"
                />
                <div class="list-content-detail">
                  <h3>{{ item.title }}</h3>
                  <div class="footer-box">
                    <p>{{ item.tags.join('|') }}</p>
                    <p>{{ new Date(item.updatedAt).toLocaleString() }}</p>
                    <div>
                      <img src="@/assets/images/View.svg" />
                      <span>{{ item.likes }}</span>
                    </div>
                    <div>
                      <img src="@/assets/images/Like.svg" />
                      <span>{{ item.views }}</span>
                    </div>
                    <div>
                      <img src="@/assets/images/CommentOutlined.svg" />
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="option-box">
                <div class="option-btn">
                  <img src="@/assets/images/Rollback.svg" />
                  <img src="@/assets/images/Edit.svg" />
                  <img src="@/assets/images/Delete.svg" />
                </div>
              </div>
            </n-list-item>
          </n-list>
          <div class="tags-box">
            <div class="tags-title">
              <span>标签</span>
              <n-button secondary strong>
                <img src=" @/assets/images/seting.svg" />
                管理标签
              </n-button>
            </div>
            <div class="tags-list">
              <n-tag size="large" round v-for="(item, idx) in state.tagsArray" :key="idx">
                {{ item }}：
                <span>0</span>
              </n-tag>
              <div v-if="isAddInput">
                <n-input v-model:value="state.tagvalue" :style="{ width: '180px' }"> </n-input>
                <n-button type="primary" ghost @click="closeAddTagInput"> 取消 </n-button>
                <n-button type="info" @click="confirmAddTag"> 确认 </n-button>
              </div>

              <n-button v-else secondary round strong @click="isAddInput = !isAddInput">
                <img src=" @/assets/images/Add.svg" />
                Add
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/userInfo'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import HeaderDetail from '@/views/BMS/components/HeaderDetail.vue'
import ClassifyManage from '@/views/BMS/components/ClassifyManage.vue'
import { ref, reactive, onMounted } from 'vue'
import { upsertCategoryTags } from '@/http/categoryTags'
import { NButton, useMessage } from 'naive-ui'
import { getAllBlogArticleApi } from '@/http/blogArticle'
const userInfoStore = useUserInfoStore()
const message = useMessage()

const headerData = reactive({
  title: '博客文章',
  url: '/bms/editarticle',
})
const isAddInput = ref(false)
interface ArticleItemType {
  cover: string
  title: string
  tags: [string]
  updatedAt: string
  likes: number
  views: number
}
interface State {
  tagvalue: string
  tagsArray: string[]
  tagsData: string[]
  updateTagCount: number
  articleData: ArticleItemType[]
}
const state = reactive<State>({
  tagvalue: '',
  tagsArray: [],
  tagsData: [],
  updateTagCount: 0,
  articleData: [],
})
interface CategoryTagsType {
  _id: string
  uid: string
  email: string
  type: string
  tags: string[]
  createdAt: string
  updatedAt: string
}
interface TagsParamsType {
  uid: string
  email: string
  type: 'article'
  tags: string[]
}
const params: TagsParamsType = reactive({
  uid: '',
  email: '',
  type: 'article',
  tags: [],
})
// 添加或更新标签接口
const upsertCategory = async (params: object) => {
  const response = await upsertCategoryTags(params)
  const res = response.data
  if (res.code === 200) {
    closeAddTagInput()
    state.updateTagCount++
    message.success(res.message)
  } else {
    message.error(res.message)
  }
}
// 确认添加标签
const confirmAddTag = () => {
  params.uid = userInfoStore.data.user._id
  params.email = userInfoStore.data.user.email
  params.tags = [...state.tagsArray, state.tagvalue]
  upsertCategory(params)
}
// 拿到分类标签数据
const getCategoryTags = (val: CategoryTagsType) => {
  console.log('tags', val)
  state.tagsArray = val.tags
}
// 关闭添加分类input
const closeAddTagInput = () => {
  isAddInput.value = false
  state.tagvalue = ''
}

// 获取文章列表数据
const getArticleData = async () => {
  const response = await getAllBlogArticleApi()
  const res = response.data
  if (res.code === 200) {
    state.articleData = res.data.list
    console.log(res.data.list)

    message.success(res.message)
  } else {
    message.error(res.message)
  }
}

onMounted(() => {
  getArticleData()
})
</script>

<style lang="scss" scoped>
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;
  .list-tag-box {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    .n-list {
      flex: 1;
    }
    :deep(.n-list-item) {
      background-color: #2e33380d;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
      .n-list-item__main {
        display: flex;
        justify-content: space-between;
      }
      .list-content {
        height: 160px;
        display: flex;
        .cover-img {
          width: 180px;
          height: 100%;
          object-fit: cover;
          margin-right: 15px;
          border-radius: 8px;
        }
        .list-content-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 15px 0;
          h3 {
            font-size: 18px;
            font-weight: 600;
            line-height: 1.34;
          }
          .footer-box {
            display: flex;
            justify-content: space-evenly;
            gap: 18px;
            div {
              display: flex;
              align-items: center;
            }
            img {
              width: 14px;
            }
          }
        }
      }
      .option-box {
        width: 450px;
        height: 160px;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        .option-btn {
          display: flex;
          justify-content: flex-end;
          img {
            width: 24px;
            margin-left: 15px;
          }
        }
      }
    }
    .tags-box {
      width: 320px;
      background-color: #2e33380d;
      padding: 10px;
      border-radius: 8px;
      .tags-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        span {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
        img {
          width: 16px;
        }
      }
      .tags-list {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        img {
          width: 16px;
        }
        span {
          font-size: 16px;
          color: #000;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
