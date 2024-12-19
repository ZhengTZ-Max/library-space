<template>
  <div class="MobileLayout" :class="{ safeArea: state.safeArea }">
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
import { reactive, onMounted } from "vue";
import { isIOS, hasBottomSafeArea } from "@/utils";
import MobileHeader from "@/layouts/MobileHeader.vue";
import MobileTabBar from "@/layouts/MobileTabBar.vue";

const state = reactive({
  safeArea: false,
});

onMounted(() => {
  let agentSystem = sessionStorage.getItem("agentSystem");
  if (isIOS() && ['DingTalk','QY_WX']?.includes(agentSystem)) {
    state.safeArea = true;
  } else {
    state.safeArea = false;
  }
});
</script>

<style scoped lang="less">
.MobileLayout {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &.safeArea {
    padding-bottom: calc(constant(safe-area-inset-bottom));
    padding-bottom: calc(env(safe-area-inset-bottom));
  }
  .MobileContent {
    flex: 1; /* 自动填充中间内容区的剩余空间 */
    overflow-y: auto; /* 允许内容区垂直滚动 */
  }
}
</style>
