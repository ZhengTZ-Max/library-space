<script setup>
import AppointmentItem from "./AppointmentItem.vue";
import Carousel from "./CarouselCom.vue";
import { reactive, onMounted, watch } from "vue";
import { getSubscribe } from "@/request/home";

const state = reactive({
  isUnfold: false,

  tabActive: "",
  config: {
    seat: { type: [1, 3, 4], list: [] },
    space: { type: [2], list: [] },
  },

  showList: [],
});

watch(
  () => state.tabActive,
  (v) => {
    let { seat, space } = state.config;
    if (v == "seat") {
      state.showList = seat?.list || [];
    } else if (v == "space") {
      state.showList = space?.list || [];
    }
    console.log(state.showList);

  }
);

onMounted(() => {
  fetchSubscribe();
});
const fetchSubscribe = async () => {
  try {
    let params = {};
    const res = await getSubscribe(params);

    if (res?.code != 0) {
      return false;
    }
    filterConfig(res?.data || []);
  } catch (e) {
    console.log(e);
  }
};

const filterConfig = (list) => {
  let { seat, space } = state.config;

  state.config.seat.list = list.filter((e) => seat?.type?.includes(e?.type));
  state.config.space.list = list.filter((e) => space?.type?.includes(e?.type));

  if (state.config.seat.list?.length) {
    state.tabActive = "seat";
  } else if (state.config.space.list?.length) {
    state.tabActive = "space";
  }
};

const onToggleCard = (type) => {
  if (type == "shrink") {
    state.isUnfold = true;
  } else {
    state.isUnfold = false;
  }
};
</script>
<template>
  <div class="appointmentsCards">
    <div
      class="unfold"
      :style="{
        transform: !state.isUnfold ? 'translateX(440px)' : 'translateX(0)',
      }"
    >
      <div
        class="appointmentsTypes"
        v-if="state.config.seat.list?.length || state.config.space.list?.length"
      >
        <div
          class="itemTab"
          :class="{ active: state.tabActive == 'seat' }"
          v-if="state.config.seat.list?.length"
        >
          座位
        </div>
        <div
          class="itemTab"
          :class="{ active: state.tabActive == 'space' }"
          v-if="state.config.space.list?.length"
        >
          空间
        </div>
      </div>
      <Transition>
        <div
          v-if="state.isUnfold"
          class="unfoldLeftBox clickBox"
          @click="onToggleCard()"
        >
          <img class="unfoldIcon" src="@/assets/home/shrinkIcon.svg" alt="" />
        </div>

        <div v-else class="shrink clickBox" @click="onToggleCard('shrink')">
          <img class="currentApp" src="@/assets/home/currentApp.svg" alt="" />
          <span>当前预约</span>
          <img class="shrinkIcon" src="@/assets/home/shrinkIcon.svg" alt="" />
        </div>
      </Transition>
      <div class="CardCon">
        <Carousel>
          <template v-slot:content>
            <template v-for="item in state.showList" :key="item?.id">
              <AppointmentItem :data="item" @getList="fetchSubscribe" />
            </template>
          </template>
        </Carousel>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.appointmentsCards {
  position: fixed;
  right: 0;
  top: 65%;
  transform: translate(0%, -65%);
  z-index: 9;

  .unfold {
    position: relative;
    display: flex;
    .appointmentsTypes {
      position: absolute;
      top: -32px;
      display: flex;
      align-items: center;
      .itemTab {
        padding: 6px 24px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px 10px 0px 0px;
        font-weight: normal;
        font-size: 15px;
        color: rgba(32, 32, 32, 0.4);
        margin-right: 2px;
        cursor: pointer;
        &.active {
          background: #ffffff;
          color: #1a49c0;
        }
      }
    }
    .CardCon {
      width: 440px;
      box-shadow: 0px 24px 48px 0px rgba(0, 13, 75, 0.24);
      background: #ffffff;
      border-radius: 0 0px 0px 10px;
    }
    .shrink {
      position: absolute;
      left: -52px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 16px;
      background: #ffffff;
      box-shadow: 0px 20px 40px 0px rgba(0, 13, 75, 0.1);
      border-radius: 10px 0px 0px 10px;

      &:active {
        opacity: 0.9;
      }
      .currentApp {
        width: 20px;
        height: 20px;
      }
      .shrinkIcon {
        width: 15px;
        height: 12px;
      }
      span {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-size: 14px;
        color: #202020;
        margin: 7px 0;
        letter-spacing: 2px;
      }
    }
    .unfoldLeftBox {
      position: absolute;
      left: -26px;
      top: calc(50% - 30px);
      padding: 24px 6px;
      background: #fff;
      border-radius: 10px 0px 0px 10px;

      .unfoldIcon {
        width: 15px;
        height: 12px;
        transform: rotate(180deg);
      }
    }
  }
}
</style>
