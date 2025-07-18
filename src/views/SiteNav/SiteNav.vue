<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="site-nav-main">
    <div class="site-classify">
      <n-button strong secondary type="primary" @click="showCreateUrl = !showCreateUrl">
        <template #icon>
          <n-icon>
            <img v-if="!showCreateUrl" src="@/assets/images/add.svg" />
            <img v-else src="@/assets/images/Subtract.svg" />
          </n-icon>
        </template>
        添加站点</n-button
      >
      <div v-show="showCreateUrl">
        <n-form ref="formRef" :model="formValue" :rules="rules">
          <n-form-item label="分类名称" path="classifyName">
            <n-input v-model:value="formValue.classifyName" maxlength="10" show-count clearable />
          </n-form-item>
          <n-form-item label="URL" path="url">
            <n-input v-model:value="formValue.url" placeholder="输入URL链接..." clearable />
          </n-form-item>
          <n-form-item label="名称">
            <n-input v-model:value="formValue.name" maxlength="30" show-count clearable />
          </n-form-item>
          <n-form-item label="描述">
            <n-input v-model:value="formValue.desc" maxlength="500" show-count clearable />
          </n-form-item>
          <n-form-item>
            <n-button strong secondary type="primary"> 确认</n-button>
          </n-form-item>
        </n-form>
      </div>
      <n-collapse
        default-expanded-names="1"
        accordion
        arrow-placement="right"
        @on-item-header-click="handleUpdateExpanded"
      >
        <n-collapse-item name="own">
          <template #header>
            <span>我的</span>
          </template>
          <template #arrow> </template>
          <div class="site-classify-item-box">
            <n-card
              hoverable
              v-for="(item, idx) in state.userSiteData"
              :key="idx"
              @click="getSiteCategoryData(item)"
            >
              {{ item.secondary }}
            </n-card>
          </div>
        </n-collapse-item>
        <n-collapse-item
          v-for="(item, idx) in state.blogSiteData"
          :key="idx"
          :title="item.primary"
          :name="idx"
        >
          <div class="site-classify-item-box">
            <n-card
              v-for="(secondaryItem, idx) in item.primaryItem"
              :key="idx"
              hoverable
              @click="getSiteCategoryData(secondaryItem)"
              >{{ secondaryItem.secondary }}</n-card
            >
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
    <div class="site-content-main-box">
      <div class="site-content-search-box">
        <n-input clearable round size="large" placeholder="输入关键字搜索...">
          <template #suffix>
            <img src="@/assets/images/searchIconfont.svg" alt="search nav" />
          </template>
        </n-input>
      </div>
      <div class="site-card-box">
        <div v-for="(f, idxf) in state.siteData" :key="idxf" class="site-content-main">
          <h3>{{ f.secondary }}</h3>
          <div class="site-content-main-item">
            <a
              class="card-item"
              v-for="(item, idx) in f.data"
              :key="idx"
              :href="item.url"
              target="_blank"
            >
              <h3>
                <div class="link-logo">
                  <img :src="item.favicon" />
                </div>
                <span>{{ item.name }}</span>
              </h3>
              <div class="link-info">{{ item.desc }}</div>
            </a>
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
import { onMounted, reactive, ref } from 'vue'
// import { getFavicon } from '../../utils/getFavicon'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'

// const targetUrl = ref('' as string)
const showCreateUrl = ref(false)

interface FormValue {
  classifyName: string
  url: string
  name: string
  desc: string
}

const formValue: FormValue = reactive({
  classifyName: '',
  url: '',
  name: '',
  desc: '',
})

interface SiteData {
  name: string
  url: string
  desc: string
  favicon: string
}

interface primaryItem {
  secondary: string
  data: SiteData[]
}

interface BlogSiteData {
  primary: string
  primaryItem: primaryItem[]
}

const state = reactive({
  userSiteData: [] as primaryItem[],
  blogSiteData: [] as BlogSiteData[],
  siteData: {} as primaryItem[],
})

const rules = {
  classifyName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入网址', trigger: 'blur' }],
}

// 展开触发
const handleUpdateExpanded = (expandedNames: Array<string | number> | string | number | null) => {
  console.log('handleUpdateExpanded', expandedNames)
}

// 获取网站图标
// const testFaviconFetching = async () => {
//   const testUrl = 'https://cn.vuejs.org/'
//   const result = await getFavicon(testUrl)
//   if (result) {
//     console.log('成功获取favicon:', result)
//     targetUrl.value = result
//     return result
//   } else {
//     return false
//   }
// }

// 获取二级分类下所有站点数据
const getSiteCategoryData = (data: primaryItem) => {
  state.siteData = [data]
}

// 获取用户站点数据
const getUserSiteData = () => {
  state.userSiteData = [
    {
      secondary: '分类名称1',
      data: [
        {
          name: '站点名称1',
          url: 'https://cn.vuejs.org/',
          desc: '描述1',
          favicon: 'https://cn.vuejs.org/images/logo.png',
        },
        {
          name: '站点名称2',
          url: 'https://cn.vuejs.org/',
          desc: '描述2',
          favicon: 'https://cn.vuejs.org/images/logo.png',
        },
      ],
    },
    {
      secondary: '分类名称2',
      data: [
        {
          name: '站点名称1',
          url: 'https://cn.vuejs.org/',
          desc: '描述1',
          favicon: 'https://cn.vuejs.org/images/logo.png',
        },
        {
          name: '站点名称2',
          url: 'https://cn.vuejs.org/',
          desc: '描述2',
          favicon: 'https://cn.vuejs.org/images/logo.png',
        },
      ],
    },
  ]
}

// 获取博客站点数据
const getSiteData = () => {
  state.blogSiteData = [
    {
      primary: '一级分类1',
      primaryItem: [
        {
          secondary: '二级分类1',
          data: [
            {
              name: '站点名称1',
              url: 'https://cn.vuejs.org/',
              desc: '描述1',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
            {
              name: '站点名称2',
              url: 'https://cn.vuejs.org/',
              desc: '描述2',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
          ],
        },
        {
          secondary: '二级分类2',
          data: [
            {
              name: '站点名称1',
              url: 'https://cn.vuejs.org/',
              desc: '描述1',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
            {
              name: '站点名称2',
              url: 'https://cn.vuejs.org/',
              desc: '描述2',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
          ],
        },
      ],
    },
    {
      primary: '一级分类2',
      primaryItem: [
        {
          secondary: '二级分类1',
          data: [
            {
              name: '站点名称1',
              url: 'https://cn.vuejs.org/',
              desc: '描述1',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
            {
              name: '站点名称2',
              url: 'https://cn.vuejs.org/',
              desc: '描述2',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
          ],
        },
        {
          secondary: '二级分类2',
          data: [
            {
              name: '站点名称1',
              url: 'https://cn.vuejs.org/',
              desc: '描述1',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
            {
              name: '站点名称2',
              url: 'https://cn.vuejs.org/',
              desc: '描述2',
              favicon: 'https://cn.vuejs.org/images/logo.png',
            },
          ],
        },
      ],
    },
  ]
}

// 获取
onMounted(() => {
  getUserSiteData()
  getSiteData()
  // testFaviconFetching()
})
</script>

<style lang="scss" scoped>
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
    background-color: #fff;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 8px;
    height: 88vh;
    overflow: hidden;
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
    }
  }
  .site-content-main-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 8px;
    background-color: #fff;
    padding: 10px 15px;
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
      height: 80vh;
      overflow: hidden;
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
          color: #333;
        }
        .site-content-main-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 30px;
          .card-item {
            cursor: pointer;
            min-width: 168px;
            max-width: 220px;
            height: 78px;
            padding: 18px;
            position: relative;
            transform: translateY(0);
            transition: all 0.2s;
            background-color: #fff;
            color: #666;
            border-radius: 12px;
            box-shadow: 0 0 2px -1px #e3e8f7;
            border: 1px solid #e3e8f7;
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
              .link-logo {
                padding: 2px;
                width: 30px;
                height: 30px;
                border-radius: 100%;
                border: 1px solid #f4f5f6;
                @include g.flexCenter;
                img {
                  width: 90%;
                  height: 90%;
                }
              }
            }
            .link-info {
              font-size: 12px;
              color: #8f8f8f;
              line-height: 18px;
              height: 36px;
              line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              white-space: inherit;
            }
          }
        }
      }
    }
  }
}
</style>
