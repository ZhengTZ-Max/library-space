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
  console.log(state.propsData);
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

    <a-carousel autoplay>
      <div
        class="reviewImg"
        v-if="systemMode != 'pc' && state.propsData?.type == 'space'"
        v-for="item in state.propsData?.img"
        :key="item"
      >
        <img :src="item" alt="" />
      </div>
    </a-carousel>
    <a-carousel autoplay>
      <div
        class="reviewImg"
        v-if="systemMode != 'pc' && state.propsData?.type == 'library'"
      >
        <img :src="state.propsData?.firstImg" alt="" />
      </div>
    </a-carousel>

    <!-- PC 端 活动详情页面 单独处理 -->
    <div
      style="
        display: flex;
        gap: 20px;
        align-items: flex-start;
        max-height: 860px;
        flex-wrap: wrap;
        overflow-x: hidden;
      "
      v-if="systemMode == 'pc' && state.propsData?.type == 'activity'"
    >
      <img
        style="width: 450px; height: 450px"
        :src="state.propsData?.firstImg"
        alt=""
      />
      <div style="max-width: 450px">
        <!-- 标题 -->
        <p class="title">
          {{ state.propsData?.nameMerge || state.propsData?.name || "-" }}
        </p>

        <!-- 座位数 -->
        <div class="seatNum">
          {{ filterCategorys(state.propsData?.categorys || []) }} (
          <span
            >可容纳{{ state.propsData?.minPerson }} ~
            {{ state.propsData?.maxPerson }}人</span
          >)
        </div>
        <div
          class="libraryIntro"
          v-html="state.propsData?.sub_title || ''"
        ></div>

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
          v-if="
            state.propsData?.sub_title && state.propsData?.type != 'library'
          "
        >
          <p class="subtitle" style="margin-top: 20px">注意事项</p>
          <div
            class="notice libraryIntro"
            v-html="state.propsData?.sub_title"
          ></div>
        </template>
      </div>
    </div>
    <div v-else>
      <!-- 标题 -->
      <p v-if="systemMode == 'pc'" class="title">
        {{ state.propsData?.nameMerge || state.propsData?.name || "-" }}
      </p>
      <p v-else class="title_mobile">
        {{ state.propsData?.nameMerge || state.propsData?.name || "-" }}
      </p>

      <!-- 座位数 -->
      <div class="seatNum" v-if="state.propsData?.type == 'library'">
        座位 ( <span>空闲{{ state.propsData?.free_num || "-" }}</span
        ><span>/总数{{ state.propsData?.total_num || "-" }}</span> )
      </div>
      <div class="seatNum" v-if="state.propsData?.type == 'space'">
        <span
          >研讨间可容纳{{ state.propsData?.minPerson }}
          <span v-if="state.propsData?.minPerson != state.propsData?.maxPerson"
            >~ {{ state.propsData?.maxPerson }}</span
          >人</span
        >
      </div>
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
  </div>
</template>
<style lang="less" scoped>
.libraryInfo {
  overflow: auto;
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
    // font-family: AliExtraBold !important;
    font-weight: bold;
  }
  .title_mobile {
    margin-top: 10px;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
    // font-family: AliExtraBold !important;
    font-weight: bold;
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
