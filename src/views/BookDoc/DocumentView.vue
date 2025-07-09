<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="document-box">
    <div class="search-box">
      <n-input round placeholder="搜索"> </n-input>
    </div>
    <div class="content-box">
      <div class="classify-box"></div>
      <div class="doc-list-box">
        <n-grid :x-gap="12" :y-gap="12" :cols="4">
          <n-grid-item v-for="(item, idx) in 10" :key="idx">
            <n-card hoverable>
              <h3>文件名称:{{ item }}</h3>
              <p>文件描述:{{ idx }}</p>
              <div class="doc-info">
                <span>类型：PDF</span>
                <span>大小：2.4MB</span>
                <span>时间：2023-11-15</span>
              </div>
              <div class="btn-box">
                <n-button type="primary" @click="downloadFile">下载</n-button>
                <n-button @click="showPreview = true">在线预览</n-button>
              </div>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </div>
  <GeneralPreview v-if="showPreview" :fileUrl="data.fileUrl" :fileName="data.fileName"></GeneralPreview>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import GeneralPreview from '@/views/PreviewComponent/GeneralPreview.vue'


const showPreview = ref(false);
const data = {
  fileUrl: '/uploads/fileList/充电.docx',
  fileName: '充电.docx'
}
// 下载文件
const downloadFile = () => {
  const link = document.createElement('a');
  link.href = data.fileUrl;
  link.download = data.fileName;
  link.click();
};
</script>

<style lang="scss" scoped>
.document-box {
  min-width: 1240px;
  max-width: 1480px;
  margin-top: calc(2vh + 64px);
  flex: 1;
  .content-box {
    display: flex;
    margin:40px 0;
    gap: 24px;
    .classify-box {
      width: 280px;
      min-height: 500px;
      border-radius: 8px;
      background-color: var(--box-bg-color1);
    }
    .doc-list-box {
      flex: 1;
      display: flex;
      :deep(.n-card){
        height: 100%;
        border-radius: 5px;
        background: url("@/assets/images/file/pdf.svg") no-repeat;
        background-size: 100%;
        background-position: center center;
        .n-card__content{
          backdrop-filter: blur(15px);
          border-radius: 5px;
        }
        h3 {
          font-size: 14px;
          font-weight: 600;
        }
        p{
          font-size: 12px;
        }
        .doc-info{
          display: flex;
          flex-direction: column;
        }
        .btn-box {
          display: flex;
          gap: 12px;
        }
      }
    }
  }
}
</style>
