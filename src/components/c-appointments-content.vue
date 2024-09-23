<script setup>

import { reactive,onMounted  } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const state = reactive({
  rightNavs: [
    { label: "常用座位", link: "reservation" },
    { label: "常用研讨室", link: "seminar-room" },
  ],
});

const isRightActiveNav = (link) => {
  return route.path?.includes(link);
};

const onChangeNav = (item) => {
  console.log(item, router);
  router.replace(`/my/c-appointments/${item?.link}`);
};
onMounted(() => {
  const defaultNav = state.rightNavs[0]; 

  if (!state.rightNavs.some(nav => route.path.includes(nav.link))) {
    router.replace(`/my/c-appointments/${defaultNav.link}`);
  }
});
</script>

<template>
  <div class="allCon">
    <div class="topNavBox">
        <template v-for="item in state.rightNavs" :key="item.link">
          <div
            class="clickBox navItem"
            :class="{ activeNav: isRightActiveNav(item.link) }"
            @click="onChangeNav(item)"
          >
            {{ item.label }}
          </div>
        </template>
    </div>
    <div class="routerCon">
        <router-view />
    </div>
  </div>
</template>

<style scoped lang="less">

.allCon {
    flex: 1;
    flex-direction: column;
    display: flex;

    .topNavBox {
        display: flex;
        border-bottom: 1px solid #EEEEEE;
        padding-bottom: 15px;
        padding-top: 16px;
        padding-left: 40px;
        background: #ffffff;
        .navItem {
            margin-right: 40px;
            font-size: 16px;
            color: #66202020;
            cursor: pointer;
        }
        .activeNav {
            font-weight: bold;
            color: #202020;
            position: relative;
        }
        .activeNav::after {
            content: '';
            position: absolute;
            bottom: -16px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #1A49C0;
        }
    }

    .routerCon{
        flex: 1;
        background: #fff;

    }
}




</style>


