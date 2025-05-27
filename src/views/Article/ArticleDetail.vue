<template>
  <div></div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.article-menu-box {
  min-width: 1240px;
  max-width: 1480px;
  margin-top: 2vh;
  flex: 1;
  .more-btn {
    @include g.flexCenter;
    margin: 50px;
    @include g.moreBtn(94px, 48px);
  }
}
</style>
