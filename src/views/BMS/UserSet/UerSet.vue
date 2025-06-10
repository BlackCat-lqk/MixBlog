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
        <h3>用户设置</h3>
        <personal-info></personal-info>
        <logo-home-screen></logo-home-screen>
        <about-set></about-set>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import HeaderView from '@/views/BMS/components/HeaderView.vue'
import NavigaMenu from '@/views/BMS/components/NavigaMenu.vue'
import PersonalInfo from './components/PersonalInfo.vue'
import LogoHomeScreen from './components/LogoHomeScreen.vue'
import AboutSet from './components/AboutSet.vue'
</script>

<style scoped lang="scss">
@include g.bms;
.main-router-box {
  padding: 10px;
  gap: 12px;
}
</style>
