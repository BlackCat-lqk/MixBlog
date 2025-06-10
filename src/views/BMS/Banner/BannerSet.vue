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
          <h3>用户设置</h3>
          <n-button v-if="newCreate" type="info" @click="switchCreate">新建</n-button>
          <n-button v-else type="info" @click="switchCreate">取消新建</n-button>
        </div>
        <div class="banner-content-box">
          <div v-if="hasData" class="content-box">
            <div v-for="(item, index) in bannerData" :key="index" class="banner-item-box">
              <div class="banner-cover-box">{{ item.cover }}</div>
              <div>{{ item.title }}</div>
              <div>{{ item.subhead }}</div>
              <div>{{ item.synopsis }}</div>
              <div>
                <n-button type="info">{{ item.mainBtnName }}</n-button>
                <n-button type="info">{{ item.childBtnName }}</n-button>
                <n-button><img style="width: 16px;" src="@/assets/images/Edit.svg"/></n-button>
                <n-button><img style="width: 16px;" src="@/assets/images/Delete.svg"/></n-button>
              </div>
            </div>
          </div>
          <div v-else class="content-box no-data-box">
            <n-empty description="还没有内容，去新建吧~!"></n-empty>
          </div>
          <div v-if="!newCreate" class="new-create-box">
            <n-form ref="formRef" :model="formBanner">
              <n-form-item label="Banner标题">
                <n-input v-model:value="formBanner.title" />
              </n-form-item>
              <n-form-item label="Banner副标题">
                <n-input v-model:value="formBanner.subhead" />
              </n-form-item>
              <n-form-item label="简要说明">
                <n-input v-model:value="formBanner.synopsis" />
              </n-form-item>
              <n-form-item label="主要按钮名称">
                <n-input v-model:value="formBanner.mainBtnName" />
              </n-form-item>
              <n-form-item label="主要按钮地址">
                <n-input v-model:value="formBanner.mainBtnNameUrl" />
              </n-form-item>
              <n-form-item label="次要按钮名称">
                <n-input v-model:value="formBanner.childBtnName" />
              </n-form-item>
              <n-form-item label="次要按钮地址">
                <n-input v-model:value="formBanner.childBtnNameUrl" />
              </n-form-item>
              <n-form-item label="上传封面">
                <n-input v-model:value="formBanner.cover" />
              </n-form-item>
              <n-form-item>
                <n-button type="info" @click="submit">发布</n-button>
              </n-form-item>
            </n-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import { ref, reactive } from 'vue'

interface bannerType {
  title: string,
  subhead: string,
  synopsis: string,
  mainBtnName: string,
  mainBtnNameUrl: string,
  childBtnName: string,
  childBtnNameUrl: string,
  cover: string
}

const formBanner: bannerType = reactive({
  title: '',
  subhead: '',
  synopsis: '',
  mainBtnName: '',
  mainBtnNameUrl: '',
  childBtnName: '',
  childBtnNameUrl: '',
  cover: '',
})

// 模拟数据
const bannerData = reactive([{
  title: '标题1',
  subhead: '副标题1',
  synopsis: '简介1',
  mainBtnName: '主按钮名称1',
  mainBtnNameUrl: '主按钮链接1',
  childBtnName: '子按钮名称1',
  childBtnNameUrl: '子按钮链接1',
  cover: 'https://picsum.photos/200/300',
}])

const newCreate = ref(true)
const hasData = ref(true)
const switchCreate = () => {
  newCreate.value = !newCreate.value

}
const submit = () => {
  console.log('submit')
}
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
  .banner-content-box{
    display: flex;
    gap: 12px;
    flex: 1;
    .content-box {
      flex: 1;

    }
    .no-data-box {
      display: flex;
      align-items: center;
      .n-empty{
        width: 100%;
      }
    }
    .new-create-box {
      flex: .4;
      min-width: 300px;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

}
</style>
