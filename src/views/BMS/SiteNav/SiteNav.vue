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
            <h5>创建站点</h5>
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
                <n-button strong secondary type="primary" @click="handleCreateSite">
                  确认</n-button
                >
              </n-form-item>
            </n-form>
          </div>
          <div class="site-nav-content-box"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
// import { getFavicon } from '@/utils/getFavicon'
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { createSiteApi, getSiteApi } from '@/http/siteNav'

// const targetUrl = ref('' as string)
const formRef = ref<FormInst | null>(null)
const message = useMessage()

interface FormValue {
  primaryCategory: string
  secondaryCategory: string
  link: string
  siteName: string
  desc: string
  type: string
}

const formValue: FormValue = reactive({
  primaryCategory: '',
  secondaryCategory: '',
  link: '',
  siteName: '',
  desc: '',
  type: '',
})

const rules = {
  primaryCategory: [{ required: true, message: '请输入一级分类名称', trigger: 'blur' }],
  secondaryCategory: [{ required: true, message: '请输入二级分类名称', trigger: 'blur' }],
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  link: [{ required: true, message: '请输入网址', trigger: 'blur' }],
}

// 表单验证
const handleCreateSite = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      formValue.type = 'user'
      console.log(formValue)
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
// const testFaviconFetching = async () => {
//   const testUrl = 'https://cn.vuejs.org/'
//   const result = await getFavicon(testUrl)
//   if (result) {
//     targetUrl.value = result
//     return result
//   } else {
//     return false
//   }
// }
// 获取站点数据
const getSiteNavData = async () => {
  const result = await getSiteApi()
  const res = result.data
  if (res.code === 200) {
    console.log('站点数据获取成功', res.data)
  } else {
    message.error('站点数据获取失败')
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
    .create-site-nav {
      width: 220px;
    }
    .site-nav-content-box {
      flex: 1;
    }
  }
}
</style>
