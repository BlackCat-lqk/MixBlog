<template>
  <div class="personal-info-box">
    <div class="personal-box">
      <div class="personal-info">
        <div class="avatar-box">
          <img src="" alt="">
        </div>
        <div class="info-box">
          <span>ikun</span>
          <span>co.com.www@qq.com</span>
        </div>
      </div>
      <div class="btn-box">
        <n-button type="info">修改个人资料</n-button>
        <n-button type="success">进入博客</n-button>
        <n-button>
          <img src="@/assets/images/QrCode.svg" alt="QrCode">
        </n-button>
      </div>
    </div>
    <div class="spatial-box">
      <div>
        <div>
          <span>文件空间</span>
          <span>1.2MB/20MB</span>
        </div>
        <n-progress type="line" :percentage="50" :height="24" :border-radius="4" :fill-border-radius="0" />
      </div>
      <div>
        <div>
          <span>发布文章</span>
          <span>1/30篇文章</span>
        </div>
        <n-progress type="line" :percentage="50" :height="24" :border-radius="4" :fill-border-radius="0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.personal-info-box {
  display: flex;
  gap: 24px;
  .personal-box {
    flex: .7;
    display: flex;
    .personal-info {
      display: flex;
      .info-box {
        display: flex;
        flex-direction: column;
      }
    }
    .btn-box {
      display: flex;
    }
  }

  .spatial-box {
    flex: .3;
    display: flex;
    align-items: center;
    gap: 24px;
  }
}
</style>
