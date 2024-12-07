<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <div class="feebback">
    <p class="title">反馈与报修</p>

    <div class="cardCon">
      <div class="cardItem clickBox">
        <img src="@/assets/feedback/opinion.svg" alt="" />
        <span>意见反馈</span>
        <img src="@/assets/feedback/rightIcon.svg" alt="" />
      </div>
      <div class="cardItem clickBox">
        <img src="@/assets/feedback/equipment.svg" alt="" />
        <span>设备报修</span>
        <img src="@/assets/feedback/rightIcon.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.feebback {
  padding: 24px 30px;
  .title {
    font-size: 20px;
    color: #202020;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 4px;
      left: 0;
      width: 110px;
      height: 6px;
      background: linear-gradient(
        90deg,
        rgba(26, 73, 192, 0.5) 0%,
        rgba(26, 73, 192, 0) 100%
      );
      border-radius: 2px 2px 2px 2px;
    }
  }
  .cardCon {
    margin-top: 30px;
    display: flex;
    align-items: center;
    .cardItem {
      padding: 20px 50px;
      flex: 1;
      height: 160px;
      background: #f8f9fd;
      border-radius: 10px;
      border: none;

      display: flex;
      align-items: center;
      span {
        margin-left: 50px;
        flex: 1;
        font-size: 30px;
        transform: skewX(-6deg);
        font-family: AliHeavy !important;
        color: var(--primary-color);
      }
      &:last-child {
        margin-left: 40px;
      }
    }
  }
}
</style>
