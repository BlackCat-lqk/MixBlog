<template>
  <header>
    <HeaderNav></HeaderNav>
  </header>
  <HomeView></HomeView>
  <footer>
    <FooterNav></FooterNav>
  </footer>
</template>

<script lang="ts" setup>
import HeaderNav from '@/views/Header/HeaderNav.vue'
import FooterNav from '@/views/Footer/FooterNav.vue'
import HomeView from '@/views/Home/HomeView.vue'
</script>

<style scoped lang="scss"></style>
