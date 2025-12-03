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
            :paramsName="classifyParamsName"
          ></classify-manage>
        </div>
        <div class="list-tag-box">
          <n-list hoverable clickable>
            <n-list-item v-for="(item, idx) in state.articleData" :key="idx">
              <div class="list-content">
                <img
                  class="cover-img"
                  :src="item?.cover ? item?.cover : '@/assets/wallpaper/about.jpg'"
                  alt="cover"
                />
                <div class="list-content-detail">
                  <div class="list-content-title">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.intro }}</p>
                  </div>
                  <div class="footer-box">
                    <p>分类：{{ item.category }}</p>
                    <p>
                      <n-tag
                        type="info"
                        size="small"
                        round
                        v-for="(tag, idx) in item.tags"
                        :key="idx"
                        >{{ tag }}</n-tag
                      >
                    </p>
                    <p>{{ _formatTime(item.updatedAt).date }}</p>
                    <div>
                      <img src="@/assets/images/views.svg" alt="view" />
                      <span>{{ item.likes.length }}</span>
                    </div>
                    <div>
                      <img src="@/assets/images/likes.svg" alt="like" />
                      <span>{{ item.views.length }}</span>
                    </div>
                    <div>
                      <img src="@/assets/images/comment.svg" alt="comment" />
                      <span>{{ item.comments.length }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="option-box">
                <div class="option-btn">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <img
                        @click="publishStatus(item)"
                        :src="getRollbackIcon(item.isHovered1, 1, item.status)"
                        @mouseenter="item.isHovered1 = true"
                        @mouseleave="item.isHovered1 = false"
                        alt="publish"
                      />
                    </template>
                    {{ item.status === 'published' ? '取消发布' : '发布' }}
                  </n-tooltip>
                  <img
                    @click="editArticle(item)"
                    :src="getRollbackIcon(item.isHovered2, 2)"
                    @mouseenter="item.isHovered2 = true"
                    @mouseleave="item.isHovered2 = false"
                    alt="edit"
                  />
                  <n-popconfirm @positive-click="deleteArticle(item._id)">
                    <template #trigger>
                      <img
                        :src="getRollbackIcon(item.isHovered3, 3)"
                        @mouseenter="item.isHovered3 = true"
                        @mouseleave="item.isHovered3 = false"
                        alt="delete"
                      />
                    </template>
                    确认删除？删除后的数据将无法恢复
                  </n-popconfirm>
                </div>
              </div>
            </n-list-item>
          </n-list>
          <div class="tags-box">
            <div class="tags-title">
              <span>标签</span>
              <n-button secondary strong> 管理标签 </n-button>
            </div>
            <div class="tags-list">
              <n-tag
                size="large"
                round
                v-for="(item, idx) in state.tagsArray"
                :key="idx"
                closable
                @close="deleteTag(item)"
              >
                {{ item }}：
                <span>{{ state.tagsCountArray[item] ? state.tagsCountArray[item] : 0 }}</span>
              </n-tag>
              <div v-if="isAddInput">
                <n-input v-model:value="state.tagvalue" :style="{ width: '180px' }"> </n-input>
                <n-button type="primary" ghost @click="closeAddTagInput"> 取消 </n-button>
                <n-button type="info" @click="confirmAddTag"> 确认 </n-button>
              </div>

              <n-button v-else secondary round strong @click="isAddInput = !isAddInput">
                <img src=" @/assets/images/Add.svg" alt="add" />
                Add
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <edit-article-form
      v-model:showModal="state.isModalVisible"
      :editData="editArticleData"
      @updateArticleList="getArticleData"
    ></edit-article-form>
  </div>
</template>

<script setup lang="ts">
import { useUserInfoStore } from '@/stores/userInfo'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import HeaderDetail from '@/views/BMS/components/HeaderDetail.vue'
import ClassifyManage from '@/views/BMS/components/ClassifyManage.vue'
import EditArticleForm from './EditArticleForm.vue'
import { upsertCategoryTags } from '@/http/categoryTags'
import { useMessage } from 'naive-ui'
import {
  getAllBlogArticleApi,
  deleteBlogArticleApi,
  updateBlogArticleApi,
} from '@/http/blogArticle'
import { _formatTime } from '@/utils/publickFun'
const userInfoStore = useUserInfoStore()
const message = useMessage()

const headerData = reactive({
  title: '博客文章',
  url: '/bms/editarticle',
})
const classifyParamsName = ref('article')
const isAddInput = ref(false)
export interface Comment {
  _id: string
  userId: string
  userName: string
  avatar: string
  content: string
  parentId: string | null
  createdAt: string
  children?: Comment[]
}

export interface LikeView {
  userId: string
  userName: string
  email: string
  viewedAt: string
  likedAt: string
}
interface ArticleItemType {
  _id: string
  cover: string
  title: string
  intro: string
  category: string
  tags: [string]
  status: string
  updatedAt: string
  likes: LikeView[]
  views: LikeView[]
  comments: Comment[]
  isHovered1: boolean
  isHovered2: boolean
  isHovered3: boolean
}
interface State {
  tagvalue: string
  tagsArray: string[]
  tagsData: string[]
  updateTagCount: number
  articleData: ArticleItemType[]
  isModalVisible: boolean
  tagsCountArray: { [key: string]: number }
}
const state = reactive<State>({
  tagvalue: '',
  tagsArray: [],
  tagsData: [],
  updateTagCount: 0,
  articleData: [],
  isModalVisible: false,
  tagsCountArray: {},
})
interface CategoryTagsType {
  _id: string
  uid: string
  email: string
  type: string
  category: string[]
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
interface editArticleDataType {
  _id: string
  title: string
  intro: string
  category: string[]
  selectCategory: string
  selectTags: string[]
  tags: string[]
  cover: string
  content: string
  count: number
  status: string
}
// 编辑窗口的数据
const editArticleData: editArticleDataType = reactive({
  _id: '',
  title: '',
  intro: '',
  category: [],
  selectCategory: '',
  selectTags: [],
  tags: [],
  cover: '',
  content: '',
  count: 0,
  status: '',
})

// 删除标签
const deleteTag = async (tag: string) => {
  if (tag) {
    if (state.tagsCountArray[tag] > 0) {
      message.info('标签下有文章，请先删除文章')
    } else {
      state.tagsArray = state.tagsArray.filter((item) => item !== tag)
      confirmAddTag()
    }
  }
}
const getRollbackIcon = (isHovered: boolean, type: number, status?: string) => {
  if (type === 1) {
    if (status === 'published') {
      return !isHovered
        ? new URL('@/assets/images/Rollback.svg', import.meta.url).href
        : new URL('@/assets/images/RollbackHover.svg', import.meta.url).href
    } else {
      return !isHovered
        ? new URL('@/assets/images/Publish.svg', import.meta.url).href
        : new URL('@/assets/images/PublishHover.svg', import.meta.url).href
    }
  } else if (type === 2) {
    return !isHovered
      ? new URL('@/assets/images/Edit.svg', import.meta.url).href
      : new URL('@/assets/images/EditHover.svg', import.meta.url).href
  } else {
    return !isHovered
      ? new URL('@/assets/images/Delete.svg', import.meta.url).href
      : new URL('@/assets/images/DeleteHover.svg', import.meta.url).href
  }
}

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
// 更新文章的发布状态
const publishStatus = async (val: ArticleItemType) => {
  val.status = val.status === 'published' ? 'unpublished' : 'published'
  const response = await updateBlogArticleApi(val)
  const res = response.data
  if (res.code === 200) {
    message.success(res.message)
    getArticleData()
  } else {
    message.error(res.message)
  }
}
// 编辑文章
const editArticle = async (val: ArticleItemType) => {
  const response = await getAllBlogArticleApi(val._id)
  const res = response.data
  if (res.code === 200) {
    const detail = res.data.list[0]
    // 拿到文章数据到编辑窗口
    editArticleData.title = detail.title
    editArticleData.intro = detail.intro
    editArticleData._id = detail._id
    editArticleData.cover = detail.cover
    editArticleData.selectCategory = detail.category
    editArticleData.selectTags = detail.tags
    editArticleData.content = detail.content
    editArticleData.status = detail.status
    editArticleData.count++
    message.success(res.message)
    state.isModalVisible = !state.isModalVisible
  } else {
    message.error(res.message)
  }
}
// 删除文章
const deleteArticle = async (id: string) => {
  const params = {
    _id: id,
  }
  const response = await deleteBlogArticleApi(params)
  const res = response.data
  if (res.code === 200) {
    message.success(res.message)
    getArticleData()
  } else {
    message.error(res.message)
  }
}
// 确认添加标签
const confirmAddTag = () => {
  params.uid = userInfoStore.data.user._id
  params.email = userInfoStore.data.user.email
  if (state.tagvalue) {
    params.tags = [...state.tagsArray, state.tagvalue]
  } else {
    params.tags = [...state.tagsArray]
  }
  upsertCategory(params)
}
// 拿到分类标签数据
const getCategoryTags = (val: CategoryTagsType) => {
  state.tagsArray = val.tags
}
// 关闭添加分类input
const closeAddTagInput = () => {
  isAddInput.value = false
  state.tagvalue = ''
}

// 获取文章列表数据
const getArticleData = async (params: string = '') => {
  const response = await getAllBlogArticleApi(params)
  const res = response.data
  if (res.code === 200) {
    state.articleData = res.data.list
    state.tagsCountArray = res.data.stats.tags
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
      background-color: rgba(22, 117, 211, 0.1);
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
          object-fit: contain;
          margin-right: 15px;
          border-radius: 8px;
        }
        .list-content-detail {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .list-content-title {
            h3 {
              font-size: 18px;
              font-weight: 600;
              line-height: 1.34;
            }
            p {
              margin-top: 12px;
              font-size: 14px;
              color: #666;
              height: 84px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              word-break: break-all;
              line-height: 1.5;
            }
          }

          .footer-box {
            display: flex;
            gap: 18px;
            align-items: center;
            flex: 1;
            div,
            p {
              display: flex;
              align-items: center;
              text-wrap: nowrap;
            }
            img {
              width: 18px;
            }
          }
        }
      }
      .option-box {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        .option-btn {
          display: flex;
          justify-content: flex-end;
          img {
            width: 18px;
            margin-left: 15px;
          }
        }
      }
    }
    .tags-box {
      width: 320px;
      background-color: rgba(22, 117, 211, 0.1);
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
          color: var(--text-color);
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
          color: var(--text-color);
          font-weight: 600;
        }
      }
    }
  }
}
</style>
