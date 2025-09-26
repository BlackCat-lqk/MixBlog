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
        <h3>站点收录</h3>
        <div class="site-nav-box">
          <div class="create-site-nav">
            <n-form ref="formRef" :model="formValue" :rules="rules">
              <n-form-item label="一级分类名称" path="primaryCategory">
                <n-input
                  v-model:value="formValue.primaryCategory"
                  maxlength="10"
                  show-count
                  clearable
                />
              </n-form-item>
              <n-form-item label="二级分类名称" path="secondaryCategory">
                <n-input
                  v-model:value="formValue.secondaryCategory"
                  maxlength="10"
                  show-count
                  clearable
                />
              </n-form-item>
              <n-form-item label="URL" path="url">
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
          <div class="site-nav-content-box">
            <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p>
            <n-button style="margin-right: 20px" type="primary" @click="selectTypeData('user')">
              User
            </n-button>
            <n-button
              style="margin-right: 20px; margin-bottom: 10px"
              type="primary"
              @click="selectTypeData('blog')"
            >
              Blog
            </n-button>
            <n-button
              style="margin-right: 20px; margin-bottom: 10px"
              type="error"
              :disabled="checkedRowKeys.length <= 0"
              @click="bitchDelData"
            >
              批量删除
            </n-button>
            <n-button type="info" :disabled="checkedRowKeys.length !== 1" @click="bitchEdit">
              编辑
            </n-button>
            <n-data-table
              :columns="columns"
              :data="tableData"
              :pagination="{ pageSize: 10 }"
              :row-key="rowKey"
              @update:checked-row-keys="handleCheck"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInst, DataTableColumns, DataTableRowKey } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { getFavicon } from '@/utils/getFavicon'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { createSiteApi, getSiteAdminApi, delSiteNavApi, updateSiteNavApi } from '@/http/siteNav'
import { _formatTime } from '@/utils/publickFun'

const faviconLink = ref('')
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const checkedRowKeysRef = ref<DataTableRowKey[]>([])
const checkedRowKeys = checkedRowKeysRef
const tableData = ref([])
interface uploader {
  _id: string
  email: string
}
const tableAllData = ref({
  user: [],
  blog: [],
})
interface RowData {
  _id: string
  uploader: uploader
  updatedAt: string
  type: string
  siteName: string
  primaryCategory: string
  secondaryCategory: string
  link: string
  icon: string
  desc: string
  createdAt: string
}

interface RowID {
  _id: string
}

function createColumns(): DataTableColumns<RowData> {
  return [
    {
      type: 'selection',
    },
    {
      title: 'type',
      key: 'type',
    },
    {
      title: '更新人',
      key: 'uploader.email',
    },
    {
      title: 'updatedAt',
      key: 'updatedAt',
      render: (row) => {
        const time = _formatTime(row.updatedAt).date
        return time
      }
    },
    {
      title: 'siteName',
      key: 'siteName',
    },
    {
      title: 'primaryCategory',
      key: 'primaryCategory',
    },
    {
      title: 'secondaryCategory',
      key: 'secondaryCategory',
    },
    {
      title: 'link',
      key: 'link',
    },
    {
      title: 'desc',
      key: 'desc',
    },
    {
      title: 'createdAt',
      key: 'createdAt',
    },
  ]
}
const columns = createColumns()
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys
}
const rowKey = (row: RowData) => row



interface FormValue {
  primaryCategory: string
  secondaryCategory: string
  link: string
  siteName: string
  desc: string
  type: string
  icon: string
}

const formValue: FormValue = reactive({
  primaryCategory: '',
  secondaryCategory: '',
  link: '',
  siteName: '',
  desc: '',
  type: '',
  icon: '',
})

const rules = {
  primaryCategory: [{ required: true, message: '请输入一级分类名称', trigger: 'blur' }],
  secondaryCategory: [{ required: true, message: '请输入二级分类名称', trigger: 'blur' }],
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  link: [{ required: true, message: '请输入网址', trigger: 'blur' }],
}
// 批量删除
const bitchDelData = async () => {
  const IDS = []
  checkedRowKeys.value.forEach((item) => {
    IDS.push(item._id)
  })
  const params = {
    ids: IDS,
  }
  const result = await delSiteNavApi(params)
  const res = result.data
  if (res.code === 200) {
    message.success(res.message)
    getSiteNavData()
    checkedRowKeys.value = []
  } else {
    message.error(res.message)
  }
}

// 编辑更新
const bitchEdit = async () => {
  console.log(checkedRowKeys.value)
  const result = await updateSiteNavApi(params)
  const res = result.data
  if (res.code === 200) {
    message.success(res.message)
    getSiteNavData()
    checkedRowKeys.value = []
  } else {
    message.error(res.message)
  }
}
// 创建站点
const handleCreateSite = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      formValue.type = 'blog'
      const faviconResult = await faviconFetching(formValue.link)
      if (faviconResult) formValue.icon = faviconLink.value
      const result = await createSiteApi(formValue)
      const res = result.data
      if (res.code === 200) {
        message.success('站点创建成功')
        formValue.primaryCategory = ''
        formValue.secondaryCategory = ''
        formValue.link = ''
        formValue.siteName = ''
        formValue.desc = '' // 清空表单
        getSiteNavData()
      } else {
        message.error('站点创建失败')
      }
    } else {
      message.error('Invalid')
    }
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
// 获取站点数据
const getSiteNavData = async () => {
  const result = await getSiteAdminApi()
  const res = result.data
  if (res.code === 200) {
    tableAllData.value = res.data
    tableData.value = res.data.blog
  } else {
    message.error('站点数据获取失败')
  }
}
// 切换type
const selectTypeData = (type: string) => {
  if (type === 'blog') {
    tableData.value = tableAllData.value.blog
  } else {
    tableData.value = tableAllData.value.user
  }
}
onMounted(() => {
  getSiteNavData()
})
</script>

<style lang="scss" scoped>
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;

  h3 {
    font-size: 18px;
    line-height: 1.34;
    font-weight: 600;
    color: #1e2025;
    padding-bottom: 10px;
  }
  .site-nav-box {
    display: flex;
    gap: 24px;
    height: 800px;
    max-height: 800px;
    .create-site-nav {
      width: 220px;
      background-color: var(--box-bg-color);
      border: 1px solid var(--border-color);
      padding: 10px;
      border-radius: 8px;
    }
    .site-nav-content-box {
      flex: 1;
      background-color: var(--box-bg-color);
      border: 1px solid var(--border-color);
      padding: 10px;
      border-radius: 8px;
    }
  }
}
</style>
