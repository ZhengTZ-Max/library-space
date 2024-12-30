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
    { value: 0, label: $t("V4_map_view") },
    { value: 1, label: $t("V4_list_view") },
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
        <div class="leftTit">
          <a-breadcrumb>
            <template #separator
              ><img src="@/assets/seat/titRightIcon.svg" alt=""
            /></template>
            <a-breadcrumb-item @click="goToLink('/bookcase')">{{
              $t("V4_select_a_bookcase")
            }}</a-breadcrumb-item>
            <a-breadcrumb-item>{{
              $t("V4_choose_a_compartment")
            }}</a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="rightAction">
          <div class="quickBtns">
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

      <div class="rightBox">
        <template v-if="state.bookInfoList?.length">
          <BookAreaSwipe
            v-if="state.bookInfoList?.length"
            :data="state.bookInfoList"
            :defaultId="state.initQuery.BookId"
            @changeSlide="onChangeSlide"
            @viewFloor="onViewMap"
          />

          <div class="reservation">
            <p class="selectSeat">
              {{ $t("Locker_Selected_number") + "： "
              }}<span>{{ state.bookSelected?.no || "-" }}</span>
            </p>
          </div>
          <a-button
            class="reserve-btn"
            shape="round"
            type="primary"
            block
            :disabled="!state.bookSelected?.id"
            @click="confirmAppt"
            >{{ $t("book_now") }}</a-button
          >
        </template>
        <a-skeleton v-else :paragraph="{ rows: 4 }" active />
      </div>
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
          <span>{{ $t("user_begintime") + "：" }}</span>
          <span>{{ state.apptResult?.data?.startTime || "-" }}</span>
        </div>
        <div class="toastItem">
          <span>{{ $t("user_endtime") + "：" }}</span>
          <span>{{ state.apptResult?.data?.endTime || "-" }}</span>
        </div>
        <div class="toastItem">
          <span>{{ $t("Reservation_location") + "：" }}</span>
          <span>{{ state.apptResult?.data?.nameMerge || "-" }}</span>
        </div>
        <div class="toastItem">
          <span>{{ $t("V4_bookcase_number") + "：" }}</span>
          <span>{{ state.bookSelected?.no || "-" }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>{{ $t("Reserved_Reserved") + "：" }}</span>
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
  .header {
    padding: 20px 30px;
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
      justify-content: flex-end;

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
    height: calc(100% - 90px);
    display: flex;
    padding: 12px 30px;
    .leftBox {
      padding: 30px;
      flex: 1;
      background: #f7f9fb;
      border-radius: 10px;
      overflow-y: auto;
    }
    .rightBox {
      margin-left: 20px;
      width: 320px;

      .reservation {
        background: #ffffff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #e7e7e7;
        padding: 20px 18px;
        margin-top: 20px;
        .studyPermission {
          margin: 0 -18px;
          padding: 0 18px;
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid #e7e7e7;
          .studyTitle {
            font-size: 15px;
            color: #202020;
            margin-bottom: 10px;
          }
          .studyBox {
            display: flex;
            justify-content: space-between;
            font-size: 15px;
            color: #616161;
            .success {
              color: #56bb46;
            }
            .fail {
              color: #202020;
            }
          }
        }

        .selectDate {
          display: flex;
          font-size: 15px;
          color: #202020;
          span {
            &:nth-child(1) {
              font-size: 15px;
              color: #1a49c0;
              margin-right: 6px;
            }
            &:nth-child(2) {
              flex: 1;
            }
          }
        }
        .selectSeat {
          font-size: 15px;
          color: #616161;
          span {
            color: #202020;
          }
        }
      }

      .reserve-btn {
        margin-top: 60px;
        font-size: 16px;
      }
    }
  }
  .librarySlt {
    width: 100%;
  }

  .spaceMapSlt {
    display: flex;
    justify-content: center;
    .spaceMap {
      max-width: 940px;
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
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
    }
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
