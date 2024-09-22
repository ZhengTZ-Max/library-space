<template>
  <header class="MobileHeader">
    <div class="left-icon" @click="goBack">
      <img src="@/assets/header/back.svg" alt="" />
    </div>

    <div class="title">
      {{ title }}
    </div>

    <div class="right-icon" @click="handleRightIconClick">
      <!-- <i class="iconfont icon-more"></i> -->
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

// 定义标题和返回按钮的逻辑
const title = ref("页面标题"); // 动态标题，可以通过props传递
const router = useRouter();

// 返回上一页
const goBack = () => {
  router.back();
};

// 右侧图标点击事件
const handleRightIconClick = () => {
  console.log("右侧图标点击");
};
</script>

<style scoped lang="less">
.MobileHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px; /* 移动端头部高度 */
  background-color: #fff;
  padding: 0 16px;
  color: white;
  font-size: 18px;

  .left-icon,
  .right-icon {
    width: 30px; /* 左右图标区域的宽度 */
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    i {
      font-size: 24px; /* 图标字体大小 */
    }
  }

  .title {
    flex: 1; /* 中间标题占满剩余空间 */
    text-align: center;
    font-weight: bold;
    font-size: 17px;
    color: #202020;
  }
}
</style>
