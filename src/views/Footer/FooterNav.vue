<template>
  <div class="Footer-main-box">
    <span>杂糅</span>
    <span>记录工作</span>
    <span>记录生活</span>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.Footer-main-box {
  width: 100%;
  height: 100px;
  border-top: 1px solid #ccc;
  background-color: rgb(255, 255, 255, 0.5);
  @include g.flexCenter;
  flex-direction: column;
  span {
    display: inline-block;
    color: #474646;
    margin: 10px 0;
    &:nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      color: #000;
    }
  }
}
</style>
