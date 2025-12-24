<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <div class="best-practice-box">

  </div>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script setup lang="ts">
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
</script>

<style lang="scss" scoped>
.best-practice-box v {
  width: 100%;
  height: calc(94vh - 40px);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color);
  gap: 5px;
  margin-top: 64px;
}
</style>
