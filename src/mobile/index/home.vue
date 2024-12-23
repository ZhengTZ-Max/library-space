<route>
  {
    meta: {
      showHead: false,
      showLeftBack:false,
      title:'menu_home',
      showTabbar:true
    }
  }
  </route>
<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import AppointmentsCards from "@/components/h-appointments-cards.vue";
import Tabs from "@/components/h-tabs.vue";
import BookRules from "@/components/BookRules.vue";
const router = useRouter();
const store = useStore();
const bannerList = computed(() => store.state.bannerList);
const noticeList = computed(() => store.state.noticeList);

const state = reactive({
  showRules: false,
});

const handleMsg = (row) => {
  console.log(row);
};
</script>

<template>
  <div class="home">
    <div class="bannerLoop">
      <a-carousel  autoplay>
        <div class="reviewImg" v-for="item in bannerList" :key="item?.id">
          <img :src="item?.content" alt="" />
        </div>
      </a-carousel>

      <div class="apptRule" @click="state.showRules = true">预约规则</div>
    </div>
    <div class="tabsCon">
      <div class="topSlide">
        <div class="line"></div>
      </div>
      <Tabs></Tabs>
      <!-- 移动端 -->
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
        <div class="moreBoc" @click="router.push(`/announ`)">
          <span class="more">查看更多</span>
          <img src="@/assets/home/rightIconPrimary.svg" alt="" />
        </div>
      </div>
    </div>
    <BookRules v-if="state.showRules" v-model:isShow="state.showRules" />
  </div>
</template>
<style scoped lang="less">
.home {
  background: #f7f8fa;
  height: 100%;
  overflow: auto;
  .bannerLoop {
    position: relative;
    width: 100%;
    .reviewImg {
      width: 100%;
      img {
        object-fit: cover;
        width: 100%;
        height: 260px;
      }
    }
    .apptRule {
      position: absolute;
      left: 0;
      top: 20%;
      padding: 3px 14px 3px 10px;
      background-color: var(--primary-color);
      font-size: 12px;
      border-radius: 0px 12px 12px 0px;
      color: #fff;
    }
  }
  .tabsCon {
    position: relative;
    padding: 0 14px;
    .topSlide {
      left: 0;
      top: -24px;
      border-radius: 24px 24px 0px 0px;
      width: 100%;
      height: 40px;
      position: absolute;
      background: #f7f8fa;
      z-index: 0;
      .line {
        width: 49px;
        height: 4px;
        background: #d7d7d7;
        border-radius: 3px 3px 3px 3px;
        margin: 8px auto 0 auto;
      }
    }
    .m-tabs {
      position: relative;
      z-index: 1;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
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
      }
      .notice-swipe {
        padding-left: 8px;

        flex: 1;
        height: 24px !important;
      }
    }
  }
}
:deep(.slick-dots-bottom) {
  bottom: 32px !important;
}
</style>
