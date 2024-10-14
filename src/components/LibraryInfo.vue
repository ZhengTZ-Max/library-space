<script setup>
import { reactive, onMounted, defineProps, watch } from "vue";
import { useStore } from "vuex";
import { getSpaceDetail } from "@/request/seat";

const store = useStore();
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
</script>
<template>
  <div class="libraryInfo">
    <p class="title">{{ state.propsData?.name || "-" }}</p>
    <div class="seatNum">
      座位（ <span>空闲{{ state.propsData?.free_num || "-" }}</span
      ><span>/总数{{ state.propsData?.total_num || "-" }}</span
      >）
    </div>
    <div class="libraryIntro" v-html="state.propsData?.contents || ''"></div>

    <template v-if="state.propsData?.boutiques?.length">
      <p class="subtitle">馆舍特征</p>

      <div class="features">
        <div v-for="item in state.propsData?.boutiques" class="item">
          <img src="@/assets/seat/PowerSupply.svg" alt="" />
          独立电源
        </div>
      </div>
    </template>

    <template v-if="state.propsData?.sub_title">
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
  .title {
    font-size: 26px;
    color: #1a49c0;
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
        margin-bottom: 7px;
      }
    }
  }
}
</style>
