<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import AppointmentsCards from "@/components/h-appointments-cards.vue";
import Tabs from "@/components/h-tabs.vue";
const store = useStore();

const state = reactive({});

const bannerList = computed(() => store.state.bannerList);

onMounted(() => {});
</script>
<template>
  <div class="home">
    <div class="content">
      <div class="homel">
        <p class="title">{{ $t("V4_welcome_to_use") }}</p>
        <div class="library">
          {{ $t("V4_library") }}<br />
          {{ $t("V4_space_reservation_system") }}
        </div>
        <Tabs></Tabs>
      </div>
      <div v-if="bannerList?.length" class="carouselCon">
        <a-carousel :dots="false" autoplay>
          <div class="reviewImg" v-for="item in bannerList" :key="item?.id">
            <img :src="item?.content" alt="" />
          </div>
        </a-carousel>
      </div>
    </div>

    <div class="footer"></div>

    <AppointmentsCards />
  </div>
</template>

<style scoped lang="less">
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    position: relative;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #ecf5ff;
    // background-image: url("@/assets/home/homeBg.svg");
    // background-position: right;
    // background-repeat: no-repeat;
    .homel {
      height: 100%;
      position: relative;
      z-index: 2;
      padding: 100px 0 0 120px;
      min-width: 400px;
      max-width: 815px;
      background: #ecf5ff;
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 350px;
        height: 100%;
        background: linear-gradient(
          to right,
          rgba(236, 245, 255, 1) 5%,
          rgba(236, 245, 255, 0) 100%
        );
        transform: translateX(100%);
      }
      .title {
        font-size: 18px;
        color: #202020;
      }
      .subtitle {
        margin-top: 20px;
        font-size: 18px;
        color: #202020;
      }
      .library {
        margin: 8px 0 0 0;
        font-weight: 400;
        font-size: 70px;
        color: #1a49c0;
        line-height: 80px;
        transform: skewX(-6deg);
        // font-family: AliHeavy !important;
        font-weight: bold;
      }
    }

    .carouselCon {
      position: absolute;
      width: calc(100% - 815px);
      height: 100%;
      right: 0;
      top: 0;
      z-index: 1;
      .reviewImg {
        width: 100%;
        height: 100%;
        overflow: hidden; /* 防止溢出 */
        position: relative; /* 如果需要使用绝对定位 */
      }

      .reviewImg img {
        width: 100%;
        height: calc(100vh - 150px);
      }
    }
  }
  .footer {
    width: 100%;
    height: 60px;
    background: linear-gradient(90deg, #1a49c0 0%, #abbef0 100%);
  }
}
</style>
