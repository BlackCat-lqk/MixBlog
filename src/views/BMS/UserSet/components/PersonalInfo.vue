<template>
  <div class="personal-info-box">
    <div class="personal-box">
      <div class="personal-info">
        <div class="avatar-box">
          <n-image
            width="100"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            :previewed-img-props="{ style: { border: '8px solid white' } }"
          />
        </div>
        <div class="info-box">
          <span>ikun</span>
          <span>co.com.www@qq.com</span>
        </div>
      </div>
      <div class="btn-box">
        <n-button type="info">修改个人资料</n-button>
        <n-button type="success">进入博客</n-button>
        <div class="qrcode-box">
          <img src="@/assets/images/QrCode.svg" alt="QrCode" />
        </div>
      </div>
    </div>
    <div class="spatial-box">
      <div>
        <div>
          <span>文件空间</span>
          <span>1.2MB/20MB</span>
        </div>
        <n-progress
          type="line"
          :percentage="50"
          :height="24"
          :border-radius="4"
          :fill-border-radius="0"
        />
      </div>
      <div>
        <div>
          <span>发布文章</span>
          <span>1/30篇文章</span>
        </div>
        <n-progress
          type="line"
          :percentage="50"
          :height="24"
          :border-radius="4"
          :fill-border-radius="0"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.personal-info-box {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  .personal-box {
    flex: 0.7;
    display: flex;
    justify-content: space-between;
    background-color: #2e33380d;
    padding: 10px;
    border-radius: 8px;
    .personal-info {
      display: flex;
      .avatar-box {
        margin-right: 18px;
      }
      .info-box {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        span {
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    .btn-box {
      display: flex;
      align-items: center;
      .n-button {
        margin-left: 5px;
      }
      .qrcode-box {
        display: flex;
        align-items: center;
        padding: 6px;
        border-radius: 8px;
        background-color: aliceblue;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin-left: 10px;
        cursor: pointer;
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  .spatial-box {
    flex: 0.3;
    display: flex;
    gap: 24px;
    flex-direction: column;
    background-color: #2e33380d;
    padding: 10px;
    border-radius: 8px;
  }
}
</style>
