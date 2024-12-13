<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { exchangeDateTime, areArraysDifferent } from "@/utils";

import {
  getLockerMap,
  getLockerDetail,
  confirmLockBox,
} from "@/request/bookcase";

import BookMap from "@/components/BookcaseCom/BookMap.vue";
import BookAreaSwipe from "@/components/BookcaseCom/BookAreaSwipe.vue";
import BookAreaList from "@/components/BookcaseCom/BookAreaList.vue";
import SeatFilterLabel from "@/components/SpaceSeat/SpaceSltLabel.vue";

import ShowInfoToast from "@/components/ShowInfoToast.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const captureArea = ref();

// const systemMode = computed(() => store.state.systemMode);

const state = reactive({
  isShowFloorPlane: false,
  activeIndex: "",

  initQuery: {
    BookId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
  },

  quickDate: route?.query?.date || "",
  quickDateList: [],

  quickMode: "0",
  quickModeList: [
    { value: 0, label: "地图模式" },
    { value: 1, label: "列表模式" },
  ],

  bookSelected: {},
  initBookList: [],
  bookList: [],
  bookInfo: {},
  bookInfoList: [],
  bookLabelList: [],
  bookLabelVal: [],

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },
});

onMounted(() => {
  if (state.initQuery?.BookId) {
    fetchInfo();
    fetchBookInfo();
  } else {
    router.go(-1);
  }
});

const fetchBookInfo = async () => {
  try {
    let params = {
      id: state.initQuery?.BookId,
    };

    let res = await getLockerDetail(params);

    if (res.code != 0) {
      return false;
    }
    state.bookList = res?.data?.lockerInfo || [];
    state.initBookList = res?.data?.lockerInfo || [];

    state.bookLabelList = res?.data?.labelInfo || [];
    state.bookLabelList = state.bookLabelList?.map((e) => {
      return { ...e, id: e?.value };
    });
    state.bookInfo = { ...state.bookInfo, ...(res?.data?.areaInfo || {}) };
    state.bookInfoList = res?.data?.lockerList;
    state.bookSelected = {};
  } catch (e) {
    console.log(e);
  }
};

const fetchInfo = async () => {
  try {
    let params = {
      id: state.initQuery?.BookId,
    };
    let res = await getLockerMap(params);
    if (res.code != 0) return;
    state.bookInfo = { ...state.bookInfo, map: res?.data || {} };
  } catch (e) {
    console.log(e);
  }
};

const goToLink = (link) => {
  if (link === -1) {
    router.go(-1);
    return false;
  }
  router.replace(link);
};

const onSelected = (v) => {
  state.bookSelected = v;
};

const onFilterLabel = (v) => {
  if (areArraysDifferent(state.bookLabelVal, v)) {
    state.bookLabelVal = v;
    console.log(v);
    if (v?.length) {
      state.bookList = state.initBookList?.filter((e) =>
        state.bookLabelVal?.includes(e?.boxType)
      );
    } else {
      state.bookList = state.initBookList;
    }
  }
};

const confirmAppt = async () => {
  try {
    let params = {
      areaId: state?.initQuery?.BookId,
      boxId: state?.bookSelected?.id,
    };
    let res = await confirmLockBox(params);

    state.apptResult = {
      show: true,
      title: res?.code == 0 ? "预约成功" : "预约失败",
      type: res?.code == 0 ? "success" : "error",
      data: res?.data,
      msg: (res?.code != 0 && res?.msg) || "",
    };
  } catch (e) {
    console.log(e);
  }
};

const onChangeSlide = (row) => {
  state.initQuery.BookId = row.id;
  state.bookList = [];
  state.bookLabelList = [];
  state.bookLabelVal = [];
  state.bookSelected = "";

  fetchInfo();
  fetchBookInfo();
};

const handleShow = (v) => {
  if (!v && state.apptResult?.type == "success") {
    router.replace("/");
  } else {
    state.apptResult.show = false;
  }
};

const onViewMap = () => {
  state.isShowFloorPlane = true;
};
</script>
<template>
  <div class="seatAppointment" ref="containerRef">
    <a-affix :offset-top="0" :target="() => containerRef">
      <div class="header">
        <div class="leftTit"></div>
        <div class="rightAction">
          <div class="quickMode">
            <div
              v-for="item in state.quickModeList"
              :key="item.label"
              class="item activeBtn"
              :class="{ itemActive: item?.value == state.quickMode }"
              @click="state.quickMode = item?.value"
            >
              {{ item?.label }}
            </div>
          </div>

          <SeatFilterLabel
            v-if="state.bookLabelList?.length"
            :list="state.bookLabelList"
            :selected="state.bookLabelVal"
            @handleSlt="onFilterLabel"
          />
        </div>
      </div>
    </a-affix>
    <div class="showCon">
      <div class="rightBox">
        <template v-if="state.bookInfoList?.length">
          <BookAreaSwipe
            v-if="state.bookInfoList?.length"
            :data="state.bookInfoList"
            :defaultId="state.initQuery.BookId"
            @changeSlide="onChangeSlide"
            @viewFloor="onViewMap"
          />
        </template>
        <a-skeleton v-else :paragraph="{ rows: 4 }" active />
      </div>
      <div class="leftBox">
        <template v-if="state.bookList?.length">
          <div v-if="state.quickMode == '1'" class="librarySlt">
            <BookAreaList
              :list="state.bookList"
              :data="state.bookInfo"
              :seatSelected="state.bookSelected"
              @selected="onSelected"
            />
          </div>

          <div
            v-if="state.quickMode == '0' && !state.isShowFloorPlane"
            class="spaceMapSlt"
            ref="captureArea"
          >
            <BookMap
              :list="state.bookList"
              :data="state.bookInfo"
              :seatSelected="state.bookSelected"
              @selected="onSelected"
            />
          </div>
        </template>
        <a-skeleton v-else :paragraph="{ rows: 12 }" active />
      </div>

      <div class="reservation">
        <p class="selectSeat">
          已选柜号： <span>{{ state.bookSelected?.no || "-" }}</span>
        </p>
      </div>
    </div>
    <div class="bottomAction">
      <van-button round block type="default" @click="router.go(-1)">
        <img src="@/assets/seat/moBackBtn.svg" alt="" />
        返回
      </van-button>
      <van-button
        round
        block
        type="primary"
        :disabled="!state.bookSelected?.id"
        @click="confirmAppt"
        >立即预约</van-button
      >
    </div>
    <ShowInfoToast
      v-if="state.apptResult.show"
      :isShow="state.apptResult.show"
      :type="state.apptResult.type"
      :title="state.apptResult.title"
      @handleShow="handleShow"
    >
      <template v-slot:content>
        <div class="toastItem">
          <span>开始时间：</span>
          <span>{{ state.apptResult?.data?.startTime || "-" }}</span>
        </div>
        <div class="toastItem">
          <span>结束时间：</span>
          <span>{{ state.apptResult?.data?.endTime || "-" }}</span>
        </div>
        <div class="toastItem">
          <span>预约地点：</span>
          <span>{{ state.apptResult?.data?.nameMerge || "-" }}</span>
        </div>
        <div class="toastItem">
          <span>存书柜号：</span>
          <span>{{ state.bookSelected?.no || "-" }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>预约提醒：</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
      </template>
    </ShowInfoToast>

    <van-overlay
      :show="state.isShowFloorPlane"
      @click="state.isShowFloorPlane = false"
    >
      <div class="wrapper captureArea">
        <BookMap
          @click.stop
          review
          :list="state.bookList"
          :data="state.bookInfo"
          :seatSelected="state.bookSelected"
        />
      </div>
    </van-overlay>
  </div>
</template>
<style lang="less" scoped>
.seatAppointment {
  height: 100%;
  overflow: auto;
  background: #f7f8fa;
  .header {
    padding: 10px 30px 0 30px;
    color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .leftTit {
      font-size: 18px;
      img {
        width: 22px;
        height: 22px;
      }
    }
    .rightAction {
      flex: 1;
      display: flex;
      justify-content: space-between;
      .quickMode {
        display: flex;
        .item {
          padding-bottom: 10px;
          font-size: 15px;
          color: #616161;
          &:first-child {
            margin-right: 40px;
          }
          &.itemActive {
            color: #202020;
            border-bottom: 2px solid #1a49c0;
          }
        }
      }

      .filters {
        margin-left: 20px;
        padding: 6px 10px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 24px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  .showCon {
    height: calc(100% - 112px);

    display: flex;
    flex-direction: column;
    padding: 12px;
    .leftBox {
      margin-top: 12px;
      padding: 14px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
      border-radius: 10px;
      overflow-y: auto;
    }
    .leftBoxMo {
      padding: 0;
    }
  }
  .librarySlt {
    width: 100%;
  }

  .spaceMapSlt {
    display: flex;
    justify-content: center;
    .spaceMap {
      width: 100%;
    }
  }

  .reservation {
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #e7e7e7;
    padding: 20px 18px;
    margin-top: 20px;

    .selectSeat {
      font-size: 15px;
      color: #616161;
      span {
        color: #202020;
      }
    }
  }
  .bottomAction {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    background: #fff;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
      img {
        margin-right: 4px;
        transform: translateY(-2px);
      }
    }
  }
}

.filterCon {
  padding: 24px 0;
  height: 100%;
  overflow: auto;
  .filterFilter {
    margin-bottom: 24px;
    background: rgba(97, 97, 97, 0.05);
    border-radius: 0px 0px 0px 0px;
    padding: 2px 10px;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 40px;
  }

  .ant-checkbox-group {
    column-gap: 36px;
    row-gap: 20px;
  }

  .ant-radio-group {
    display: inline-flex;
    column-gap: 36px;
    row-gap: 20px;
  }
}

.toastItem {
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #616161;
  margin-bottom: 10px;
  span {
    &:nth-child(1) {
      min-width: 75px;
      text-align: right;
    }
    &:nth-child(2) {
      flex: 1;
    }
  }
}
.captureArea {
  :deep(.spaceMap) {
    margin: 0 auto;
    width: 80%;
    height: auto;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
