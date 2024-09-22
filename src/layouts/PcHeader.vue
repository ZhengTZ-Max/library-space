<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const state = reactive({
  navList: [
    {
      label: "首页",
      link: "home",
    },
    {
      label: "我的",
      link: "my",
    },
    {
      label: "规则",
      link: "rule",
    },
  ],
});

const isActiveNav = (link) => {
  return route.path?.includes(link);
};
const onChangeNav = (item) => {
  router.push(`/${item?.link}`);
};
</script>
<template>
  <header class="PcHeader">
    <div class="navl">
      <div class="navItem activeBtn">
        <img src="@/assets/languageToggle.svg" alt="" />
      </div>
      <div
        v-for="item in state.navList"
        :key="item.link"
        class="navItem activeBtn"
        :class="{ activeLink: isActiveNav(item.link) }"
        @click="onChangeNav(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="navr">
      <!-- <div class="navItem">我的</div> -->
      <div class="navItem activeBtn">
        <img src="@/assets/loginout.svg" alt="" />
      </div>
    </div>
  </header>
</template>

<style lang="less">
.PcHeader {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 40px;
  width: 100%;
  height: 90px;
  background: #1a49c0;
  font-size: 16px;
  color: #ffffff;

  .navl {
    flex: 1;
    display: flex;
    align-items: center;
    .navItem {
      padding-bottom: 6px;
      margin-right: 70px;
      cursor: pointer;
    }
    .activeLink {
      border-bottom: 2px solid #98b5ff;
    }
  }
  .navr {
    display: flex;
    align-items: center;
    .navItem {
      cursor: pointer;
    }
  }
}
</style>
