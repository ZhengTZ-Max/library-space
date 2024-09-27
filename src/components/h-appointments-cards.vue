<script setup>
import AppointmentItem from "./AppointmentItem.vue";
import Carousel from "./CarouselCom.vue";
import { reactive } from "vue";

const state = reactive({
  isUnfold: false,
});

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
          <span>立即预约</span>
          <img class="shrinkIcon" src="@/assets/home/shrinkIcon.svg" alt="" />
        </div>
      </Transition>
      <div class="CardCon">
        <Carousel>
          <template v-slot:content>
            <AppointmentItem />
            <AppointmentItem />
            <AppointmentItem />
            <AppointmentItem />
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
  .unfold {
    position: relative;
    display: flex;
    .CardCon {
      width: 440px;
      box-shadow: 0px 24px 48px 0px rgba(0, 13, 75, 0.24);
      background: #ffffff;
      border-radius: 10px 0px 0px 10px;
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
