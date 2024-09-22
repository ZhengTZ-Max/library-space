<template>
  <div class="MobileLayout">
    <!-- 头部导航 -->
    <MobileHeader></MobileHeader>

    <!-- 中间内容区域 -->
    <div class="MobileContent">
      <router-view />
    </div>

    <!-- 底部 Tab 栏 -->
    <MobileTabBar></MobileTabBar>
  </div>
</template>

<script setup>
import MobileHeader from "@/layouts/MobileHeader.vue";
import MobileTabBar from "@/layouts/MobileTabBar.vue";
</script>

<style scoped lang="less">
.MobileLayout {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  .MobileContent {
    flex: 1; /* 自动填充中间内容区的剩余空间 */
    overflow-y: auto; /* 允许内容区垂直滚动 */
  }
}
</style>
