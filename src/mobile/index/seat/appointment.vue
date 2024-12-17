<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";

import { exchangeDateTime, initSltTime, areArraysDifferent } from "@/utils";
import {
  getSpaceDetail,
  getSpaceMap,
  getSpaceLabel,
  getSpaceSeat,
  getSpaceRule,
  getSpaceConfirm,
  getCheckStudyOpenTime,
  fetchStudyConfirm,
  addCollect,
  deleteCollect,
} from "@/request/seat";
import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceFilterDate from "@/components/SpaceSeat/SpaceFilterDate.vue";
import SpaceSeatStudy from "@/components/SpaceSeat/SpaceSeatStudy.vue";
import SpaceSeatMap from "@/components/SpaceSeat/SpaceSeatMap.vue";
import SeatAreaSwipe from "@/components/SpaceSeat/SeatAreaSwipe.vue";
import SeatAreaList from "@/components/SpaceSeat/SeatAreaList.vue";
import SeatFilterLabel from "@/components/SpaceSeat/SpaceSltLabel.vue";
import SpaceRuleConfirm from "@/components/SpaceSeat/SpaceRuleConfirm.vue";
import ShowInfoToast from "@/components/ShowInfoToast.vue";
import { showToast } from "vant";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const captureArea = ref();
const systemMode = computed(() => store.state.systemMode);

const state = reactive({
  isShowFloorPlane: false,
  libraryInfoShow: false,
  libraryInfo: {},
  spaceFilterShow: false,
  activeIndex: "",

  initQuery: {
    spaceId: route?.query?.id || "",
    quickDate: route?.query?.date || "",
  },

  quickDate: route?.query?.date || "",
  quickDateList: [],

  quickMode: "0",
  quickModeList: [
    { value: 0, label: "地图模式" },
    { value: 1, label: "列表模式" },
  ],

  spaceSelected: {},
  spaceList: [],
  spaceInfo: {},
  spaceLabelList: [],
  spaceLabelVal: [],

  filterSearch: {
    library: [],
    floor: [],
    seatType: [],
    date: "",
    boutique: [],
    times: {},
    time: "",
    dateId: "",
  },

  filterDate: {
    date: "",
    times: {},
    time: "",
  },

  spaceRuleShow: false,
  ruleInfo: {},

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },

  studyOpenTime: [],
});

onMounted(() => {
  if (state.initQuery?.spaceId) {
    fetchInfo();
    state.filterSearch.date = state.initQuery.quickDate;
    state.filterDate.date = state.initQuery.quickDate;
  } else {
    router.go(-1);
  }
});

// const handleShowInfo = (item) => {
//   state.libraryInfo = {
//     id: item.id,
//     type: "library",
//   };
//   fetchInfo();
// };

const getStudyPermission = ({ index, id }) => {
  if (state?.spaceInfo?.type == 1) {
    return true;
  }
  let findRow;

  if (id) {
    findRow = state.studyOpenTime?.find((e) => e?.id == id);
  } else {
    findRow = state.studyOpenTime[index];
  }
  if (findRow && findRow?.id) {
    return findRow?.isvalid == 1;
  }
  return false;
};

const fetchLibraryInfo = async () => {
  try {
    let params = {
      id: state.initQuery.spaceId,
    };
    let res = await getSpaceDetail(params);
    if (res.code != 0) return;
    // state.libraryInfo = res?.data || {};
    state.libraryInfo = { ...res?.data, type: "space" } || {};
    state.libraryInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};

const fetchSpace = async () => {
  try {
    state.spaceList = [];

    let { date, times, time, begdate, enddate } = state.filterSearch;

    let dateType = state.spaceInfo?.date?.reserveType;

    let params = {
      id: state.initQuery?.spaceId,
      day: "",
      label_id: state.spaceLabelVal,
      start_time: times?.start || "",
      end_time: times?.end || "",
      begdate: begdate || "",
      enddate: enddate || "",
    };
    if (!params?.begdate) {
      params.day = date;
      if (dateType == 2) {
        params.start_time = time;
        params.end_time = time;
      } else if (dateType == 3) {
        params.start_time = time[0];
        params.end_time = time[1];
      }
    }
    let res = await getSpaceSeat(params);

    if (res.code != 0) {
      return false;
    }

    state.spaceList = res?.data?.list || [];

    let findRow = state.spaceList?.find(
      (e) => e?.id == state.spaceSelected?.id
    );
    if (!findRow) {
      state.spaceSelected = {};
    } else {
      state.spaceSelected = findRow;
    }
  } catch (e) {
    console.log(e);
  }
};

const fetchLabel = async () => {
  try {
    let res = await getSpaceLabel({ id: state.initQuery?.spaceId });
    if (res.code != 0) return;
    state.spaceLabelList = res?.data || {};
    // state.libraryInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};

const fetchInfo = async () => {
  try {
    let params = {
      id: state.initQuery?.spaceId,
    };
    let res = await getSpaceMap(params);
    if (res.code != 0) return;
    state.spaceInfo = res?.data || {};
    fetchRule();
    fetchLabel();

    if (state.spaceInfo?.type != "1") {
      fetchCheckStudyOpenTime();
    } else {
      initSltTimes();
      fetchSpace();
    }
  } catch (e) {
    console.log(e);
  }
};

const initSltTimes = () => {
  let curDate = state.spaceInfo?.date?.list?.find(
    (e) => e?.day == state.filterSearch?.date
  );
  let dateType = state.spaceInfo?.date?.reserveType;

  if (!curDate) {
    let firstDate = state.spaceInfo?.date?.list[0];
    state.filterSearch.date = firstDate?.day;
    state.filterDate.date = firstDate?.day;
    curDate = firstDate;
  }
  if (dateType == 1) {
    state.filterSearch.time = curDate?.times[0]?.id;
    state.filterSearch.times = curDate?.times[0];
  } else if (dateType == 2) {
    state.filterSearch.time = curDate?.times[0][0];
  } else if (dateType == 3) {
    if (state.filterSearch?.date == exchangeDateTime(new Date(), 2)) {
      let [start, end] = initSltTime(
        curDate?.times[0]?.end,
        curDate?.min_time || 30
      );

      curDate.times[0].start = start;
      curDate.times[0].end = end;
    }

    let cStart = curDate.times[0].start;

    state.filterSearch.time = [
      cStart,
      moment(cStart, "HH:mm")
        .add(Number(curDate?.min_time), "minutes")
        .format("HH:mm"),
    ];
  }

  state.filterDate.time = state.filterSearch?.time;
  state.filterDate.times = state.filterSearch?.times;
};
const fetchCheckStudyOpenTime = async () => {
  try {
    let params = {
      area: state.initQuery?.spaceId,
    };
    let res = await getCheckStudyOpenTime(params);
    if (res.code != 0) return;
    state.studyOpenTime = res?.data?.map((e, i) => {
      if (i == 0) {
        e.showLabel = "本期";
      } else if (i == 1) {
        e.showLabel = "下期";
      }

      return e;
    });
    state.filterDate.date = state.studyOpenTime[0]?.id;
    state.filterSearch.dateId = state.studyOpenTime[0]?.id;

    let findCurDate = state.studyOpenTime[0];

    state.filterSearch = {
      ...state.filterSearch,
      begdate: findCurDate?.startDay,
      enddate: findCurDate?.endDay,
    };
    fetchSpace();
  } catch (e) {
    console.log(e);
  }
};

const fetchRule = async () => {
  try {
    let params = {
      id: state.initQuery?.spaceId,
    };
    let res = await getSpaceRule(params);
    if (res.code != 0) return;
    state.ruleInfo = res?.data;
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

const handleFilter = (type) => {
  state.spaceFilterShow = false;

  if (type == "cancel") {
    state.filterDate = {
      date: state.filterSearch.date,
      times: state.filterSearch.times,
      time: state.filterSearch.time,
    };
    return false;
  }

  if (state.spaceInfo?.type != 1) {
    console.log(state.filterDate);
    let findCurDate = state.studyOpenTime?.find(
      (e) => e?.id == state.filterDate?.date
    );

    state.filterSearch = {
      ...state.filterSearch,
      begdate: findCurDate?.startDay,
      enddate: findCurDate?.endDay,
      dateId: findCurDate?.id,
    };
  } else {
    let dateType = state.spaceInfo?.date?.reserveType;
    if (dateType == 1) {
      state.filterSearch = {
        ...state.filterSearch,
        ...state.filterDate,
      };
    } else if (dateType == 2) {
      state.filterSearch = {
        ...state.filterSearch,
        ...state.filterDate,
      };
    } else if (dateType == 3) {
      state.filterSearch = {
        ...state.filterSearch,
        ...state.filterDate,
      };
    }
  }

  fetchSpace();
};

const onSelected = (v) => {
  state.spaceSelected = v;
};

const onFilterLabel = (v) => {
  if (areArraysDifferent(state.spaceLabelVal, v)) {
    state.spaceLabelVal = v;
    fetchSpace();
  }
};

const handleAppt = () => {
  state.spaceRuleShow = false;
  confirmAppt();
};

const confirmAppt = async () => {
  try {
    let dateType = state.spaceInfo?.date?.reserveType;

    let res;

    if (state.spaceInfo?.type != 1) {
      let { begdate, enddate } = state.filterSearch;

      let params = {
        seat_id: state.spaceSelected?.id,
        begdate: begdate,
        enddate: enddate,
      };
      res = await fetchStudyConfirm(params);
    } else {
      let params = {
        seat_id: state.spaceSelected?.id,
        segment: "",
        day: state.filterSearch.date,
        start_time: "",
        end_time: "",
      };
      let searchTime = state.filterSearch.time;
      if (dateType == 1) {
        params.segment = searchTime;
      } else if (dateType == 2) {
        // params.start_time = searchTime;
        params.end_time = searchTime;
      } else if (dateType == 3) {
        params.start_time = searchTime[0];
        params.end_time = searchTime[1];
      }
      console.log(params);
      res = await getSpaceConfirm(params);
    }

    state.apptResult = {
      show: true,
      title: res?.code == 0 ? "预约成功" : "预约失败",
      type: res?.code == 0 ? "success" : "error",
      msg: (res?.code != 0 && res?.message) || "",
    };
  } catch (e) {
    console.log(e);
  }
};

const ShowSelectedDateTime = () => {
  if (state.spaceInfo?.type != 1) {
    let findCurDate = state.studyOpenTime?.find(
      (e) => e?.id == state.filterSearch?.dateId
    );
    if (findCurDate) {
      return `${findCurDate?.startDay} ~ ${findCurDate?.endDay}`;
    } else {
      return ``;
    }
  } else {
    let dateType = state.spaceInfo?.date?.reserveType;
    let { times, time, date } = state.filterSearch;
    if (dateType == 1) {
      return `${date} ${times?.start}~${times?.end}`;
    } else if (dateType == 2) {
      return `${date} ${time}`;
    } else if (dateType == 3) {
      return `${date} ${time[0]}~${time[1]}`;
    }
  }
};

const ShowArea = () => {
  let { premise_name, storey_name, name } = state.spaceInfo;
  return `${premise_name} - ${storey_name} - ${name}`;
};

const onChangeSlide = (row) => {
  state.initQuery.spaceId = row.id;
  state.spaceList = [];
  state.spaceLabelList = [];
  state.spaceLabelVal = [];
  state.spaceSelected = "";

  fetchInfo();
};

const handleShow = (v) => {
  state.apptResult.show = v;
  if (!v && state.apptResult?.type == "success") {
    router.replace("/mo/current");
  }
};

const onViewMap = () => {
  state.isShowFloorPlane = true;
};

const fetchAddCollect = async () => {
  try {
    let params = {
      spaceId: state.spaceSelected?.id,
    };
    let res = await addCollect(params);
    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res.msg,
      });
      return false;
    }
    state.spaceSelected.is_collect = 1;
    state.spaceList = state.spaceList?.map((e) => {
      let row = { ...e };
      if (e?.id == state.spaceSelected.id) {
        e.is_collect = 1;
      }
      return row;
    });

    showToast({
      duration: 800,
      message: res.msg,
    });
  } catch (e) {}
};

const fetchDeleteCollect = async () => {
  try {
    let params = {
      spaceId: state.spaceSelected?.id,
    };
    let res = await deleteCollect(params);
    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res.msg,
      });
      return false;
    }
    state.spaceSelected.is_collect = 0;
    state.spaceList = state.spaceList?.map((e) => {
      let row = { ...e };
      if (e?.id == state.spaceSelected.id) {
        e.is_collect = 0;
      }
      return row;
    });
    showToast({
      duration: 800,
      message: res.msg,
    });
  } catch (e) {}
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
            v-if="state.spaceLabelList?.length"
            :list="state.spaceLabelList"
            :selected="state.spaceLabelVal"
            @handleSlt="onFilterLabel"
          />
        </div>
      </div>
    </a-affix>
    <div class="showCon">
      <div class="rightBox">
        <template v-if="state.spaceInfo?.name">
          <SeatAreaSwipe
            v-if="state.spaceInfo?.brother_area?.length"
            :data="state.spaceInfo"
            :defaultId="state.initQuery.spaceId"
            @viewInfo="fetchLibraryInfo"
            @changeSlide="onChangeSlide"
            @viewFloor="onViewMap"
          />
        </template>
        <a-skeleton v-else :paragraph="{ rows: 4 }" active />
      </div>
      <div class="leftBox" :class="{ leftBoxMo: state.quickMode == '0' }">
        <template v-if="state.spaceList?.length">
          <div v-if="state.quickMode == '1'" class="librarySlt">
            <SeatAreaList
              :list="state.spaceList"
              :data="state.spaceInfo"
              :seatSelected="state.spaceSelected"
              @selected="onSelected"
            />
          </div>

          <div
            v-if="state.quickMode == '0' && !state.isShowFloorPlane"
            class="spaceMapSlt"
            ref="captureArea"
          >
            <SpaceSeatMap
              :list="state.spaceList"
              :data="state.spaceInfo"
              :seatSelected="state.spaceSelected"
              @selected="onSelected"
            />
          </div>
          <!-- <div
            
            class="captureArea"
            
            style="
              width: 1920px;
              height: 1080px;
              position: absolute;
              top: -9999px;
              left: -9999px;
              z-index: -2;
              display: inline-block;
            "
          >
            <SpaceSeatMap :list="state.spaceList" :data="state.spaceInfo" />
          </div> -->
        </template>
        <a-skeleton v-else :paragraph="{ rows: 12 }" active />
      </div>
      <div class="reservation">
        <div v-if="state.spaceInfo?.type != 1" class="studyPermission">
          <p class="studyTitle">预约权限</p>
          <div class="studyBox">
            <p>
              本期：<span
                :class="{
                  success: getStudyPermission({ index: 0 }),
                  fail: !getStudyPermission({ index: 0 }),
                }"
                class="success"
                >{{
                  getStudyPermission({ index: 0 }) ? "已获得" : "未获得"
                }}</span
              >
            </p>
            <p>
              下期：<span
                :class="{
                  success: getStudyPermission({ index: 1 }),
                  fail: !getStudyPermission({ index: 1 }),
                }"
                >{{
                  getStudyPermission({ index: 1 }) ? "已获得" : "未获得"
                }}</span
              >
            </p>
          </div>
        </div>
        <div class="selectDate">
          <span v-if="state?.spaceInfo?.type == 1">今天</span>
          <span v-else>{{
            state.studyOpenTime?.find(
              (e) => e?.id == state.filterSearch?.dateId
            )?.showLabel
          }}</span>
          <span>{{ ShowSelectedDateTime() }} </span>
          <img
            style="cursor: pointer"
            @click="state.spaceFilterShow = true"
            src="@/assets/seat/selectDate.svg"
            alt=""
          />
        </div>
        <div class="selectSeat">
          <div class="leftText">
            已选座位： <span>{{ state.spaceSelected?.no || "-" }}</span>
          </div>
          <div
            v-if="state?.spaceInfo?.type == 1 && state.spaceSelected?.no"
            class="collectBox"
          >
            <img
              v-if="state.spaceSelected?.is_collect == 0"
              class="activeBtn"
              @click="fetchAddCollect"
              src="@/assets/seat/collectIcon.svg"
              alt=""
            />

            <img
              v-else
              class="activeBtn"
              @click="fetchDeleteCollect"
              src="@/assets/seat/collectedIcon.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>

    <!-- <a-button
        class="reserve-btn"
        shape="round"
        type="primary"
        block
        @click="state.spaceRuleShow = true"
        :disabled="!state.spaceSelected?.id"
        >立即预约</a-button
      > -->
    <div class="bottomAction">
      <van-button round block type="default" @click="router.go(-1)">
        <img src="@/assets/seat/moBackBtn.svg" alt="" />
        返回
      </van-button>
      <van-button
        round
        block
        type="primary"
        @click="state.spaceRuleShow = true"
        :disabled="
          !state.spaceSelected?.id ||
          !getStudyPermission({ id: state.filterSearch?.dateId })
        "
        >{{
          !getStudyPermission({ id: state.filterSearch?.dateId })
            ? "无预约权限"
            : "立即预约"
        }}</van-button
      >
    </div>

    <van-popup
      v-model:show="state.libraryInfoShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <div class="libraryPop">
        <LibraryInfo v-if="state.libraryInfo?.id" :data="state.libraryInfo" />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.libraryInfoShow = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            返回
          </van-button>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model:show="state.spaceFilterShow"
      position="bottom"
      :style="{ height: '60%' }"
    >
      <div class="spacefilterDateCon">
        <SpaceFilterDate
          v-if="state.spaceInfo?.type == 1"
          :date="state.spaceInfo?.date"
          :initSearch="state.filterDate"
        />
        <SpaceSeatStudy
          v-else
          :initSearch="state.filterDate"
          :options="state.studyOpenTime"
        />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="handleFilter('cancel')"
          >
            取消
          </van-button>
          <van-button
            round
            block
            type="primary"
            @click="handleFilter"
            :disabled="
              state.spaceInfo?.type != 1
                ? !state?.filterDate?.date
                : !state?.filterDate?.time
            "
            >确认</van-button
          >
        </div>
      </div>
    </van-popup>

    <SpaceRuleConfirm
      v-if="state.spaceRuleShow"
      v-model:open="state.spaceRuleShow"
      :content="state.ruleInfo?.content"
      @onConfirm="handleAppt"
    />

    <ShowInfoToast
      v-if="state.apptResult.show"
      :isShow="state.apptResult.show"
      :type="state.apptResult.type"
      :title="state.apptResult.title"
      @handleShow="handleShow"
    >
      <template v-slot:content>
        <div class="toastItem">
          <span>时间：</span>
          <span>{{ ShowSelectedDateTime() }}</span>
        </div>
        <div class="toastItem">
          <span>地点：</span>
          <span>{{ ShowArea() }}</span>
        </div>
        <div class="toastItem">
          <span>座位：</span>
          <span>{{ state.spaceSelected?.no || "-" }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>提醒：</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
      </template>
    </ShowInfoToast>

    <van-overlay
      :show="state.isShowFloorPlane"
      @click="state.isShowFloorPlane = false"
    >
      <div class="wrapper captureArea">
        <SpaceSeatMap
          @click.stop
          review
          :list="state.spaceList"
          :data="state.spaceInfo"
        />
      </div>
    </van-overlay>
    <!-- <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible: state.isShowFloorPlane,
        onVisibleChange: (v) => {
          state.isShowFloorPlane = v;
        },
      }"
      :src="state.floorPlaneMapSrc"
    /> -->
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
    :deep(.spaceMap) {
      width: 100%;
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
    margin-top: 20px;
    font-size: 15px;
    color: #616161;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: #202020;
    }
  }
}

.reserve-btn {
  margin-top: 60px;
  font-size: 16px;
}

.toastItem {
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #616161;
  margin-bottom: 10px;
  &:nth-child(1) {
    min-width: 75px;
    text-align: right;
  }
  &:nth-child(2) {
    flex: 1;
  }
}
.captureArea {
  :deep(.spaceMap) {
    width: 100%;
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

.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  :deep(.libraryInfo) {
    flex: 1;
    padding: 14px;
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

.spacefilterDateCon {
  height: 100%;
  display: flex;
  flex-direction: column;
  .filterCon {
    flex: 1;
  }
}
</style>
