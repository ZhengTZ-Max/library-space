<script setup>
import { reactive, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { getSpaceDetail } from "@/request/seat";

const store = useStore();
const systemMode = computed(() => store.state.systemMode);
const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  propsData: {},
  spaceInfo: {},
});

onMounted(() => {
  state.propsData = props?.data || {};
  //   fetchInfo();
});

// const fetchInfo = async () => {
//   try {
//     let params = {
//       id: state.propsData?.id,
//     };
//     let res = await getSpaceDetail(params);
//     if (res.code != 0) return;
//     state.propsData = res?.data || {};
//   } catch (e) {
//     console.log(e);
//   }
// };

const filterCategorys = (list) => {
  let newList = list?.map((e) => e?.name);
  return newList?.join("/") || "";
};
</script>
<template>
  <div class="libraryInfo">
    <!-- 轮播图 -->

    <!-- <van-swipe
      v-if="systemMode != 'pc' && state.propsData?.type == 'activity'"
      :autoplay="3000"
      indicator-color="white"
    >
      <van-swipe-item v-for="(item, index) in state.propsData?.img" :key="item">
        <img
          width="100%"
          height="290px"
          :src="item"
          alt="Empty state illustration"
        />
      </van-swipe-item>
    </van-swipe> -->

    <a-carousel autoplay>
      <div
        class="reviewImg"
        v-if="systemMode != 'pc' && state.propsData?.type == 'activity'"
        v-for="item in state.propsData?.img"
        :key="item"
      >
        <img :src="item" alt="" />
      </div>
    </a-carousel>
    <!-- <a-carousel autoplay>
      <div
        class="reviewImg"
        v-if="systemMode != 'pc' && state.propsData?.type == 'space'"
        v-for="item in state.propsData?.img"
        :key="item"
      >
        <img :src="item" alt="" />
      </div>
    </a-carousel> -->

    <a-carousel autoplay>
      <div
        class="reviewImg"
        v-if="
          systemMode != 'pc' &&
          (state.propsData?.type == 'library' ||
            state.propsData?.type == 'space')
        "
      >
        <img :src="state.propsData?.firstImg" alt="" />
      </div>
    </a-carousel>

    <!-- 标题 -->
    <p v-if="systemMode == 'pc'" class="title">
      {{ state.propsData?.nameMerge || state.propsData?.name || "-" }}
    </p>
    <p v-else class="title_mobile">
      {{ state.propsData?.nameMerge || state.propsData?.name || "-" }}
    </p>

    <!-- 座位数 -->
    <div
      class="seatNum"
      v-if="
        state.propsData?.type == 'library' || state.propsData?.type == 'space'
      "
    >
      座位 ( <span>空闲{{ state.propsData?.free_num || "-" }}</span
      ><span>/总数{{ state.propsData?.total_num || "-" }}</span> )
    </div>
    <!-- <div class="seatNum" v-if="state.propsData?.type == 'space'">
      {{ state.propsData?.type_name }} (
      <span
        >可容纳{{ state.propsData?.minPerson }} ~
        {{ state.propsData?.maxPerson }}人</span
      >)
    </div> -->
    <div class="seatNum" v-if="state.propsData?.type == 'activity'">
      {{ filterCategorys(state.propsData?.categorys || []) }} (
      <span
        >可容纳{{ state.propsData?.minPerson }} ~
        {{ state.propsData?.maxPerson }}人</span
      >)
    </div>
    <div class="libraryIntro" v-html="state.propsData?.contents || ''"></div>

    <!-- 馆舍特征 -->
    <template v-if="state.propsData?.boutiques?.length">
      <p class="subtitle">馆舍特征</p>

      <div class="features">
        <div v-for="item in state.propsData?.boutiques" class="item">
          <img :src="item?.icon" alt="" />
          {{ item?.name }}
        </div>
      </div>
    </template>

    <!-- 注意事项 -->
    <template
      v-if="state.propsData?.sub_title && state.propsData?.type != 'library'"
    >
      <p class="subtitle" style="margin-top: 20px">注意事项</p>
      <div
        class="notice libraryIntro"
        v-html="state.propsData?.sub_title"
      ></div>
    </template>
  </div>
</template>
<style lang="less" scoped>
.libraryInfo {
  .reviewImg {
    width: 100%;
    img {
      width: 100%;
      height: 300px;
    }
  }

  .my_swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
  .title {
    font-size: 26px;
    color: #1a49c0;
    font-family: AliExtraBold !important;
  }
  .title_mobile {
    margin-top: 10px;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
    font-family: AliExtraBold !important;
  }
  .seatNum {
    margin: 14px 0;
    font-size: 15px;
    color: #202020;
    span {
      &:nth-child(1) {
        color: #f28800;
      }
      &:nth-child(2) {
        color: #616161;
      }
    }
  }

  .libraryIntro {
    color: #616161;
    font-size: 14px;
  }

  .subtitle {
    margin: 40px 0 10px 0;
    font-size: 15px;
    color: #202020;
  }

  .features {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .item {
      min-width: 90px;
      height: 90px;
      background: #ffffff;
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 10px 10px 10px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      color: #616161;
      margin-right: 12px;
      margin-bottom: 20px;
      img {
        width: 36px;
        height: 36px;
        margin-bottom: 7px;
      }
    }
  }
}
</style>
