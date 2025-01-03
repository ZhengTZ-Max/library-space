<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import AppointmentsCards from "@/components/h-appointments-cards.vue";
import Tabs from "@/components/h-tabs.vue";
const store = useStore();
const router = useRouter();
const state = reactive({});

const bannerList = computed(() => store.state.bannerList);
const apiConfig = computed(() => store.state.apiConfig);
const lang = computed(() => store.state.lang);
const noticeList = computed(() => store.state.noticeList);

onMounted(() => {});

const handleMsg = (row) => {
  console.log(row);
  router.push({
    path: "/notice",
    query: {
      id: row?.id,
    },
  });
};
</script>
<template>
  <div class="home">
    <div class="content">
      <div class="homel">
        <div class="title">
          <span>{{ $t("V4_welcome_to_use") }}</span>

          <!-- <div class="moreBoc" >
            <span class="more">{{ $t("See_More") }}</span>
            <img src="@/assets/home/rightIconPrimary.svg" alt="" />
          </div> -->

          <div v-if="noticeList?.length" class="notice">
            <img class="volume" src="@/assets/home/volume.svg" alt="" />

            <van-swipe
              class="notice-swipe"
              :autoplay="3000"
              vertical
              :show-indicators="false"
            >
              <van-swipe-item v-for="item in noticeList" :key="item.id">
                <span class="title_item" @click="handleMsg(item)">{{
                  item?.title
                }}</span>
              </van-swipe-item>
            </van-swipe>
            <div class="moreBoc" @click="router.push('/notice')">
              <span class="more">{{ $t("See_More") }}</span>
              <img src="@/assets/home/rightIconPrimary.svg" alt="" />
            </div>
          </div>
        </div>
        <div class="library">
          {{ lang == "zh" ? apiConfig?.web?.title : apiConfig?.web?.entitle }}
          <!-- {{ $t("V4_library") }}<br /> -->
          <!-- {{ $t("V4_space_reservation_system") }} -->
        </div>
        <Tabs></Tabs>
      </div>
      <div v-if="bannerList?.length" class="carouselCon">
        <a-carousel autoplay effect="fade">
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
        font-size: 55px;
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
:deep(.slick-dots-bottom) {
  bottom: 22px !important;
}

.notice {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  box-sizing: border-box;
  margin: 18px auto;
  border-radius: 10px;
  position: relative;
  .moreBoc {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    cursor: pointer;
    img {
      transform: translateY(-1px);
    }
  }
  .notice-swipe {
    padding-left: 8px;

    flex: 1;
    height: 24px !important;
  }
}
</style>
