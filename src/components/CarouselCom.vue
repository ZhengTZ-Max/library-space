<template>
  <a-carousel ref="carouselRef" arrows dotsClass="carouseDots" v-bind="$attrs">
    <template #prevArrow>
      <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
        <img src="@/assets/home/prevLeft.svg" alt="" />
      </div>
    </template>
    <template #nextArrow>
      <div class="custom-slick-arrow" style="right: 10px">
        <img src="@/assets/home/nextRight.svg" alt="" />
      </div>
    </template>

    <slot name="content"></slot>
  </a-carousel>
</template>
<script setup>
import { ref } from "vue";
const carouselRef = ref(null);

const goToSlide = (index) => {
  carouselRef.value?.goTo(index, true);
};

// 暴露 goToSlide 方法给父组件
defineExpose({
  goToSlide,
});
</script>
<style scoped lang="less">
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 100%;
  overflow: hidden;
  padding-bottom: 40px;
}

:deep(.slick-arrow.custom-slick-arrow) {
  top: auto;
  bottom: 5%;
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  transition: ease all 0.3s;
  z-index: 16 !important;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  color: #fff;
  opacity: 0.75;
}

:deep(.slick-slide h3) {
  color: #fff;
}

:deep(.carouseDots) {
  bottom: 3px;
  li {
    width: 5px;
    height: 5px;
    background: rgba(26, 73, 192, 0.3);
    border-radius: 50%;
    &.slick-active {
      width: 5px;
      height: 5px;
      background: #1a49c0;
    }
    button {
      background: rgba(26, 73, 192, 0.3) !important;
    }
  }
}
</style>
