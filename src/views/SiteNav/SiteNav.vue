<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="site-nav-main">
    <div class="site-classify">
      <n-button strong secondary type="primary" @click="showCreateInput">
        <template #icon>
          <n-icon>
            <img width="20px" v-if="!showCreateUrl" src="@/assets/images/add.svg" alt="添加" />
            <img width="20px" v-else src="@/assets/images/Subtract.svg" alt="Subtract" />
          </n-icon>
        </template>
        添加站点</n-button
      >
      <div v-show="showCreateUrl">
        <n-form ref="formRef" :model="formValue" :rules="rules">
          <n-form-item label="分类名称" path="secondaryCategory">
            <n-input
              v-model:value="formValue.secondaryCategory"
              maxlength="10"
              show-count
              clearable
            />
          </n-form-item>
          <n-form-item label="URL" path="link">
            <n-input v-model:value="formValue.link" placeholder="输入URL链接..." clearable />
          </n-form-item>
          <n-form-item label="名称" path="siteName">
            <n-input v-model:value="formValue.siteName" maxlength="30" show-count clearable />
          </n-form-item>
          <n-form-item label="描述">
            <n-input v-model:value="formValue.desc" maxlength="500" show-count clearable />
          </n-form-item>
          <n-form-item>
            <n-button strong secondary type="primary" @click="handleCreateSite"> 确认</n-button>
          </n-form-item>
        </n-form>
      </div>
      <n-collapse accordion arrow-placement="right" @on-item-header-click="handleUpdateExpanded">
        <n-collapse-item name="own">
          <template #header>
            <span>我的</span>
          </template>
          <div class="site-classify-item-box">
            <n-card
              hoverable
              v-for="(item, idx) in state.userSiteData"
              :key="idx"
              :style="
                themeStore.currentTheme == 'dark'
                  ? 'background: linear-gradient(to right, #004e92, #191d21)'
                  : 'background: linear-gradient(to right, #2980b9, #ffffff)'
              "
              @click="getSiteCategoryData(item, 'user')"
            >
              {{ item.secondaryCategory }}
            </n-card>
          </div>
        </n-collapse-item>
        <n-collapse-item
          v-for="(item, key) in state.blogSiteData"
          :key="key"
          :title="item.primaryCategory"
          :name="key"
        >
          <div class="site-classify-item-box">
            <n-card
              v-for="(secondaryItem, idx) in item.primaryItem"
              :key="idx"
              hoverable
              :style="
                themeStore.currentTheme == 'dark'
                  ? 'background: linear-gradient(to right, #004e92, #191d21)'
                  : 'background: linear-gradient(to right, #2980b9, #ffffff)'
              "
              @click="getSiteCategoryData(secondaryItem, 'blog')"
              >{{ secondaryItem.secondaryCategory }}</n-card
            >
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
    <div class="site-content-main-box">
      <!-- <div class="site-content-search-box">
        <n-input
          clearable
          round
          size="large"
          v-model:value="searchKeyWord"
          placeholder="输入关键字搜索..."
          @input="handleSearch"
        >
          <template #suffix>
            <img src="@/assets/images/searchIconfont.svg" alt="search nav" />
          </template>
        </n-input>
      </div> -->
      <div class="site-card-box">
        <div v-for="(f, idxf) in state.siteData" :key="idxf" class="site-content-main">
          <h3>{{ f.secondaryCategory }}</h3>
          <div class="site-content-main-item">
            <div
              class="card-item"
              v-for="(item, idx) in f.data"
              :key="idx"
              @mouseenter="hoverItem = idxf + '-' + idx"
              @mouseleave="hoverItem = ''"
              :style="cardItemStyle(idx)"
            >
              <a @click.prevent="handleLinkClick(item.link)">
                <h3>
                  <div class="link-logo">
                    <img :src="item.icon" @error="webIconImageError" alt="web icon" />
                  </div>
                  <span>{{ item.siteName }}</span>
                </h3>
                <div class="link-info">{{ item.desc }}</div>
              </a>
              <div
                :class="
                  hoverItem == idxf + '-' + idx && showDelBtn
                    ? 'active-opretion-btn'
                    : 'opretion-btn'
                "
              >
                <n-popconfirm @positive-click="delSiteNav(item._id)">
                  <template #trigger>
                    <img width="20px" src="@/assets/images/deleteHover.svg" alt="删除" />
                  </template>
                  确认删除吗？
                </n-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
import { useMessage, useNotification } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import { getFavicon } from '../../utils/getFavicon'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import { createSiteApi, getSiteApi, delSiteNavApi } from '@/http/siteNav'
import { useUserInfoStore } from '@/stores/userInfo'
import { useThemeStore } from '@/stores/themeStore'
import _ from 'lodash'

const themeStore = useThemeStore()
const notification = useNotification()
const router = useRouter()
const collapseName = ref('')
// const searchKeyWord = ref('')
const hoverItem = ref('')
const showDelBtn = ref(false)
const userInfoStore = useUserInfoStore()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const showCreateUrl = ref(false)
const faviconLink = ref('')
const allSiteNavData = ref({
  user: [],
  blog: [],
})
const cardItemBgDark = [
  'background: linear-gradient(to right, #000428, #004e92)',
  'background: linear-gradient(to right, #360033, #0b8793)',
]
const cardItemBgLight = [
  'background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6)',
  'background: linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)',
]
const cardItemStyle = (idx: number) => {
  const i = idx % 2 ? 1 : 0
  if (themeStore.currentTheme == 'dark') {
    return cardItemBgDark[i]
  }
  return cardItemBgLight[i]
}
interface FormValue {
  type: string
  primaryCategory: string
  secondaryCategory: string
  link: string
  siteName: string
  desc: string
  icon: string
}

const formValue: FormValue = reactive({
  type: 'user',
  primaryCategory: 'mysite',
  secondaryCategory: '',
  link: '',
  siteName: '',
  desc: '',
  icon: '',
})

interface SiteData {
  siteName: string
  link: string
  desc: string
  icon: string
  _id: string
}

interface primaryItem {
  secondaryCategory: string
  data: SiteData[]
}

interface BlogSiteData {
  primaryCategory: string
  primaryItem: primaryItem[]
}

const state = reactive({
  userSiteData: [] as primaryItem[],
  blogSiteData: [] as BlogSiteData[],
  siteData: {} as primaryItem[],
})

const rules = {
  secondaryCategory: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  link: [{ required: true, message: '请输入网址', trigger: 'blur' }],
}

// 展开触发
const handleUpdateExpanded = (expandedNames: Array<string | number> | string | number | null) => {
  console.log('handleUpdateExpanded', expandedNames)
}

const showCreateInput = () => {
  if (userInfoStore.data.user.isLogin) {
    showCreateUrl.value = !showCreateUrl.value
  } else {
    message.info('请先登录')
    router.push('/register-login')
  }
}

// icon图片加载失败
const webIconImageError = (event: Event) => {
  const imgElement = event.target as HTMLImageElement
  imgElement.src = '/uploads/defalut/web.svg'
  imgElement.onerror = null
}

// 创建站点
const handleCreateSite = _.debounce((e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const faviconResult = await faviconFetching(formValue.link)
      if (faviconResult) formValue.icon = faviconLink.value
      const result = await createSiteApi(formValue)
      const res = result.data
      if (res.code === 200) {
        message.success('站点创建成功')
        formValue.secondaryCategory = ''
        formValue.link = ''
        formValue.siteName = ''
        formValue.desc = ''
        getSiteNavData()
      } else if (res.code === 401) {
        message.info('请先登录')
        router.push('/register-login')
      } else {
        message.error('站点创建失败')
      }
    } else {
      message.error('提交失败，请检查输入信息')
    }
  })
}, 300)

// 删除站点
const delSiteNav = async (site: string) => {
  const params = {
    ids: [site],
  }
  const result = await delSiteNavApi(params)
  const res = result.data
  if (res.code === 200) {
    message.success(res.message)
    getSiteNavData()
  } else {
    message.error(res.message)
  }
}

// 外部网站跳转
const handleLinkClick = (url: string) => {
  let count = 3
  const n = notification.create({
    title: '将访问外部网站',
    content: `${count} 秒后跳转：${url}`,
    duration: 3000,
    closable: false,
    onAfterEnter: () => {
      const minusCount = () => {
        count--
        n.content = `${count} 秒后跳转：${url}`
        if (count > 0) {
          window.setTimeout(minusCount, 1000)
        }
      }
      window.setTimeout(minusCount, 1000)
    },
    onAfterLeave: () => {
      window.open(url, '_blank')
    },
  })
}

// 获取网站图标
const faviconFetching = async (val: string) => {
  const result = await getFavicon(val)
  if (result) {
    faviconLink.value = result
    return true
  } else {
    return false
  }
}

// 获取二级分类下所有站点数据
const getSiteCategoryData = (data: primaryItem, type: string) => {
  if (type === 'user') {
    showDelBtn.value = true
  } else {
    showDelBtn.value = false
  }
  state.siteData = [data]
}

// 搜索
// const handleSearch = (val: string) => {
//   state.siteData = state.siteData.filter((item: siteNav) => {
//     item.primaryItem.some((item: primaryItem) => {
//       return item.siteName.includes(val)
//     })
//   })
// }

interface siteNav {
  primaryCategory: string
  primaryItem: []
}
// 获取站点数据
const getSiteNavData = async () => {
  // 是否已登录，登录获取id返回数据
  const params = {
    userId: userInfoStore.data.user._id || '',
  }
  const result = await getSiteApi(params)
  const res = result.data
  if (res.code === 200) {
    allSiteNavData.value = res.data
    state.blogSiteData = res.data?.blog
    if (res.data?.user.length > 0) {
      const filterUserSiteData = res.data.user.filter(
        (item: siteNav) => item.primaryCategory == 'mysite',
      )
      collapseName.value = 'own'
      state.userSiteData = filterUserSiteData[0].primaryItem
      state.siteData = filterUserSiteData[0].primaryItem
      showDelBtn.value = true
    } else {
      collapseName.value = res.data?.blog[0].primaryCategory
      state.siteData = res.data?.blog[0].primaryItem
      showDelBtn.value = false
    }
  } else {
    message.error('服务器出错啦')
  }
}
onMounted(() => {
  getSiteNavData()
})
</script>

<style lang="scss" scoped>
.active-collapse-item {
  :deep(.n-collapse-item__header) {
    background-color: #2898ee; // 您可以选择任何喜欢的颜色
  }
}
.site-nav-main {
  min-width: 1240px;
  max-width: 1480px;
  flex: 1;
  display: flex;
  margin-bottom: 40px;
  margin-top: calc(2vh + 80px);
  gap: 16px;
  .site-classify {
    width: 220px;
    height: auto;
    background-color: var(--box-bg-color1);
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 8px;
    height: 88vh;
    overflow: hidden;
    img {
      width: 20px;
      height: 20px;
    }
    &:hover {
      overflow-y: auto;
      @include g.scrollbarCustom;
    }
    .n-button {
      width: 100%;
    }
    .site-classify-item-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      :deep(.n-card) {
        cursor: pointer;
        border: none;
      }
    }
  }
  .site-content-main-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 8px;
    background-color: var(--box-bg-color1);
    // padding: 10px 15px;
    width: 1480px;
    &::after {
      content: '';
      width: 100%;
      height: 2%;
      background: var(--box-bg-color10);
      border-radius: 0 0 8px 8px;
      opacity: 0.5;
    }
    .site-content-search-box {
      display: flex;
      justify-content: center;
      .n-input {
        width: 50%;
        transition: all 0.5s;
        &:hover {
          width: 60%;
          transition: all 0.5s;
        }
        img {
          width: 20px;
        }
      }
    }
    .site-card-box {
      height: 86vh;
      overflow: hidden;
      padding: 10px 15px;
      &:hover {
        overflow-y: auto;
        @include g.scrollbarCustom;
      }
      .site-content-main {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
        h3 {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text-color);
        }
        .site-content-main-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 30px;
          .card-item {
            cursor: pointer;
            width: 220px;
            max-width: 220px;
            height: 78px;
            padding: 18px;
            position: relative;
            transform: translateY(0);
            transition: all 0.2s;
            background-color: var(--box-bg-color1);
            color: var(--text-color);
            border-radius: 12px;
            box-shadow: 0 0 2px -1px #e3e8f7;
            border: 1px solid #e3e8f7;
            .active-opretion-btn {
              position: absolute;
              right: 0;
              top: 0;
              z-index: 10;
              margin: 5px;
            }
            .opretion-btn {
              display: none;
            }
            &:hover {
              border-color: #3e4a5c;
              box-shadow:
                0 0 0 1px #00000002,
                0 2px 15px #0000000f;
              transform: translateY(-4px);
            }
            h3 {
              display: flex;
              font-size: 16px;
              gap: 6px;
              align-items: center;
              margin: 0 0 8px;
              line-height: 20px;
              font-weight: 700;
              height: 32px;
              color: var(--text-color);
              .link-logo {
                padding: 2px;
                width: 30px;
                height: 30px;
                @include g.flexCenter;
                img {
                  width: 90%;
                  height: 90%;
                }
              }
            }
            .link-info {
              font-size: 12px;
              color: var(--text-color);
              line-height: 18px;
              height: 36px;
              line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              white-space: inherit;
              padding-top: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
