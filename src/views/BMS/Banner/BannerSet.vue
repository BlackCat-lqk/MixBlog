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
        <div class="banner-set-header-box">
          <h3>首页Banner设置</h3>
          <n-button v-if="newCreate" type="info" @click="switchCreate">新建</n-button>
          <n-button v-else type="info" @click="switchCreate">取消新建</n-button>
        </div>
        <div class="banner-content-box">
          <div v-if="hasData" class="content-box">
            <div v-for="(item, index) in bannerData" :key="index" class="banner-item-box">
              <div class="banner-cover-box">
                <img :src="item.cover">
              </div>
              <div>{{ item.title }}</div>
              <div>{{ item.sub }}</div>
              <div>{{ item.introduction }}</div>
              <div class="btn-box">
                <n-button type="info">{{ item.mainBtnName }}</n-button>
                <n-button type="info">{{ item.childBtnName }}</n-button>
                <n-button @click="editBanner(item)"><img style="width: 16px;" src="@/assets/images/Edit.svg" />
                </n-button>
                <n-button @click="handleDeleteBanner(item._id)"><img style="width: 16px;"
                    src="@/assets/images/Delete.svg" />
                </n-button>
              </div>
            </div>
          </div>
          <div v-else class="content-box no-data-box">
            <n-empty description="还没有内容，去新建吧~!"></n-empty>
          </div>
          <div v-if="!newCreate" class="new-create-box">
            <n-form style="width: 100%;" ref="formRef" :model="formBanner">
              <n-form-item label="Banner标题">
                <n-input v-model:value="formBanner.title" />
              </n-form-item>
              <n-form-item label="Banner副标题">
                <n-input v-model:value="formBanner.sub" />
              </n-form-item>
              <n-form-item label="简要说明">
                <n-input v-model:value="formBanner.introduction" />
              </n-form-item>
              <n-form-item label="主要按钮名称">
                <n-input v-model:value="formBanner.mainBtnName" />
              </n-form-item>
              <n-form-item label="主要按钮地址">
                <n-input v-model:value="formBanner.mainBtnUrl" />
              </n-form-item>
              <n-form-item label="次要按钮名称">
                <n-input v-model:value="formBanner.childBtnName" />
              </n-form-item>
              <n-form-item label="次要按钮地址">
                <n-input v-model:value="formBanner.childBtnUrl" />
              </n-form-item>
              <n-form-item label="上传封面">
                <n-input v-model:value="formBanner.cover" />
              </n-form-item>
              <n-form-item class="banner-submit-btn-box">
                <n-button type="info" @click="submit">发布</n-button>
              </n-form-item>
            </n-form>
          </div>
        </div>
        <n-modal v-model:show="state.showEditModal" style="width: 600px; padding: 10px" preset="dialog" title="编辑Banner">
          <div class="edit-from-box">
            <n-form ref="editFormRef" inline :model="editFormValue">
              <n-grid :cols="24" :x-gap="24">
                <n-form-item-gi :span="12" label="封面" path="cover">
                  <n-input v-model:value="editFormValue.cover" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="标题" path="title">
                  <n-input v-model:value="editFormValue.title" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="副标题" path="sub">
                  <n-input v-model:value="editFormValue.sub" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="简介说明" path="introduction">
                  <n-input v-model:value="editFormValue.introduction" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="主按钮名称" path="mainBtnName">
                  <n-input v-model:value="editFormValue.mainBtnName" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="次按钮名称" path="childBtnName">
                  <n-input v-model:value="editFormValue.childBtnName" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="主按钮链接" path="mainBtnUrl">
                  <n-input v-model:value="editFormValue.mainBtnUrl" />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="次按钮链接" path="childBtnUrl">
                  <n-input v-model:value="editFormValue.childBtnUrl" />
                </n-form-item-gi>
              </n-grid>
            </n-form>
            <div class="edit-btn-space" style="display: flex; justify-content: flex-end;">
              <n-button style="margin-right: 5px" @click="state.showEditModal = false">
                取消
              </n-button>
              <n-button type="info" @click="handleEditValidate"> 确认 </n-button>
            </div>
          </div>
        </n-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { createBanner, getAllBanners, deleteBanner, updateBanner } from '@/http/banner'
import { ref, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()
const state = reactive({
  showEditModal: false,
})
let editFormValue: bannerType = reactive({
  _id: '',
  uId: '',
  email: '',
  title: '',
  sub: '',
  introduction: '',
  mainBtnName: '',
  childBtnName: '',
  mainBtnUrl: '',
  childBtnUrl: '',
  cover: '',
})
interface bannerType {
  _id: string,
  uId: string,
  email: string,
  title: string,
  sub: string,
  introduction: string,
  mainBtnName: string,
  mainBtnUrl: string,
  childBtnName: string,
  childBtnUrl: string,
  cover: string
}
// 表单数据
const formBanner: bannerType = reactive({
  _id: '',
  uId: '',
  email: '',
  title: '',
  sub: '',
  introduction: '',
  mainBtnName: '',
  mainBtnUrl: '',
  childBtnName: '',
  childBtnUrl: '',
  cover: '',
})
// 模拟数据
const bannerData = ref<bannerType[]>([])

const newCreate = ref(true)
const hasData = ref(true)
const switchCreate = () => {
  newCreate.value = !newCreate.value
  initFrom()
}
const initFrom = () => {
  formBanner.uId = ''
  formBanner.email = ''
  formBanner.title = ''
  formBanner.sub = ''
  formBanner.introduction = ''
  formBanner.mainBtnName = ''
  formBanner.mainBtnUrl = ''
  formBanner.childBtnName = ''
  formBanner.childBtnUrl = ''
  formBanner.cover = ''
}
const submit = async () => {
  formBanner.uId = 'uid test'
  formBanner.email = 'email test'
  const res = await createBanner(formBanner)
  initFrom()
  getBannerList()
  newCreate.value = true
  message.success(res.data.message)
}
const getBannerList = async () => {
  const res = await getAllBanners()
  bannerData.value = res.data.data
}
// 删除Banner配置
const handleDeleteBanner = async (ids: string) => {
  const res = await deleteBanner({ ids: [ids] })
  message.success(res.data.message)
  getBannerList()
}

// 编辑Banner配置
const editBanner = (item: bannerType) => {
  state.showEditModal = true
  editFormValue = item
}
// 编辑Banner配置确认提交
const handleEditValidate = async () => {
  const res = await updateBanner(editFormValue._id, editFormValue)
  message.success(res.data.message)
  getBannerList()
  state.showEditModal = false
}

onMounted(() => {
  getBannerList()
})
</script>

<style scoped lang="scss">
@include g.bms;

.main-router-box {
  padding: 10px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  .banner-set-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .banner-content-box {
    display: flex;

    .content-box {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 12px;

      .banner-item-box {
        background-color: #2e33380d;
        border-radius: 8px;
        padding: 10px;
        min-height: 280px;
        height: auto;

        div {
          margin: 10px 0;
        }

        .btn-box {
          display: flex;

          .n-button {
            margin-right: 10px;
          }
        }

        .banner-cover-box {
          width: 100%;
          height: 180px;
          min-width: 240px;
          min-height: 180px;
          border-radius: 8px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }
        }
      }
    }

    .no-data-box {
      display: flex;
      align-items: center;

      .n-empty {
        width: 100%;
      }
    }

    .new-create-box {
      flex: .4;
      min-width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 18px;
      background-color: #2e33380d;
      border-radius: 8px;
      padding: 10px;
      align-items: flex-start;
      height: auto;

      .banner-submit-btn-box {
        display: flex;
        justify-content: flex-end;
      }
    }
  }

}
</style>
