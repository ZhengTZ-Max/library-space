<template>
  <footer class="MobileTabBar">
    <!-- 左侧 Tab -->
    <div
      class="tab-item"
      :class="{ active: isActiveTab('/mo/home') }"
      @click="handleClick('home')"
    >
      <div class="icon-wrapper">
        <img
          v-if="isActiveTab('/mo/home')"
          src="@/assets/tabbar/homeAct.svg"
          alt=""
        />
        <img v-else src="@/assets/tabbar/home.svg" alt="" />
      </div>
      <div class="text">首页</div>
    </div>

    <!-- 中间凸起图标 -->
    <div class="tab-item tab-middle" @click="handleClick('center')">
      <div class="icon-middle">
        <img src="@/assets/tabbar/current.svg" alt="" />
      </div>
    </div>

    <!-- 右侧 Tab -->
    <div
      class="tab-item"
      :class="{ active: isActiveTab('/mo/profile') }"
      @click="handleClick('profile')"
    >
      <div class="icon-wrapper">
        <img
          v-if="isActiveTab('/mo/profile')"
          src="@/assets/tabbar/myAct.svg"
          alt=""
        />
        <img v-else src="@/assets/tabbar/my.svg" alt="" />
      </div>
      <div class="text">我的</div>
    </div>
  </footer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const handleClick = (tab) => {
  console.log(`Tab clicked: ${tab}`);
  // 可根据业务需求实现导航或其他逻辑
  router.replace(`/mo/${tab}`);
};

const isActiveTab = (link) => {
  return route.path?.includes(link);
};
</script>

<style scoped lang="less">
.MobileTabBar {
  padding: 0 16px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  background: #ffffff;
  box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.05);
  height: 54px;

  .tab-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    cursor: pointer;
    color: #333;

    .icon-wrapper {
      font-size: 24px;
    }

    .text {
      font-size: 12px;
    }
    &.active {
      font-weight: bold;
      color: #1a49c0;
    }
  }

  /* 中间凸起的图标 */
  .tab-middle {
    position: relative;
    top: -20px; /* 让图标凸起 */
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon-middle {
      font-size: 30px;
      color: white;
    }
  }
}
</style>
