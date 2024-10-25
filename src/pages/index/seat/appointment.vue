<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import html2canvas from "html2canvas";

import { exchangeDateTime, initSltTime, areArraysDifferent } from "@/utils";
import {
  getSpaceDetail,
  getSpaceMap,
  getSpaceLabel,
  getSpaceSeat,
  getSpaceRule,
  getSpaceConfirm,
} from "@/request/seat";
import LibraryInfo from "@/components/LibraryInfo.vue";
import SpaceFilterDate from "@/components/SpaceFilterDate.vue";
import SpaceSeatMap from "@/components/SpaceSeatMap.vue";
import SeatAreaSwipe from "@/components/SeatAreaSwipe.vue";
import SeatAreaList from "@/components/SeatAreaList.vue";
import SeatFilterLabel from "@/components/SpaceSltLabel.vue";
import SpaceRuleConfirm from "@/components/SpaceRuleConfirm.vue";
import ShowInfoToast from "@/components/ShowInfoToast.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const captureArea = ref();
const state = reactive({
  isShowFloorPlane: false,
  floorPlaneMapSrc: "",
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

  quickMode: "1",
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

const fetchLibraryInfo = async () => {
  try {
    let params = {
      id: state.initQuery.spaceId,
    };
    let res = await getSpaceDetail(params);
    if (res.code != 0) return;
    state.libraryInfo = res?.data || {};
    state.libraryInfoShow = true;
  } catch (e) {
    console.log(e);
  }
};

const fetchSpace = async () => {
  try {
    state.spaceList = [];

    let { date, times, time } = state.filterSearch;
    let dateType = state.spaceInfo?.date?.reserveType;

    let params = {
      id: state.initQuery?.spaceId,
      day: date,
      label_id: state.spaceLabelVal,
      start_time: times?.start || "",
      end_time: times?.end || "",
      begdate: "",
      enddate: "",
    };
    if (dateType == 2) {
      params.start_time = time;
      params.end_time = time;
    } else if (dateType == 3) {
      params.start_time = time[0];
      params.end_time = time[1];
    }
    let res = await getSpaceSeat(params);

    if (res.code != 0) {
      return false;
    }

    state.spaceList = res?.data?.list || [];
    state.spaceSelected = {};
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
    initSltTimes();
    fetchRule();
    fetchSpace();
    fetchLabel();
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
    let res = await getSpaceConfirm(params);
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
  let dateType = state.spaceInfo?.date?.reserveType;
  let { times, time, date } = state.filterSearch;
  if (dateType == 1) {
    return `${date} ${times?.start}~${times?.end}`;
  } else if (dateType == 2) {
    return `${date} ${time}`;
  } else if (dateType == 3) {
    return `${date} ${time[0]}~${time[1]}`;
  }
};

const ShowArea = () => {
  let { premise_name, storey_name, name } = state.spaceInfo;
  return `${premise_name} ${storey_name} ${name}`;
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
  if (!v && state.apptResult?.type == "success") {
    router.replace("/");
  }
};

const captureMap = () => {
  console.log(captureArea);
  html2canvas(captureArea.value).then((canvas) => {
    let imageUrl = canvas.toDataURL("image/png"); // 获取图片链接
    state.floorPlaneMapSrc = imageUrl;
    state.isShowFloorPlane = true;
  });
};
const onViewMap = () => {
  captureMap();
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
            <a-breadcrumb-item @click="goToLink('/seat')"
              >选择馆舍</a-breadcrumb-item
            >
            <a-breadcrumb-item @click="goToLink(-1)"
              >选择空间</a-breadcrumb-item
            >
            <a-breadcrumb-item>选择座位</a-breadcrumb-item>
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
            v-if="state.spaceLabelList?.length"
            :list="state.spaceLabelList"
            :selected="state.spaceLabelVal"
            @handleSlt="onFilterLabel"
          />
        </div>
      </div>
    </a-affix>
    <div class="showCon">
      <div class="leftBox">
        <template v-if="state.spaceList?.length">
          <div v-if="state.quickMode == '1'" class="librarySlt">
            <SeatAreaList
              :list="state.spaceList"
              :data="state.spaceInfo"
              :seatSelected="state.spaceSelected"
              @selected="onSelected"
            />
          </div>

          <div v-if="state.quickMode == '0'" class="spaceMapSlt">
            <SpaceSeatMap
              :list="state.spaceList"
              :data="state.spaceInfo"
              :seatSelected="state.spaceSelected"
              @selected="onSelected"
            />
          </div>
          <div
            ref="captureArea"
            style="
              position: absolute;
              top: -9999px;
              left: -9999px;
              z-index: -2;
              display: inline-block;
            "
          >
            <SpaceSeatMap :list="state.spaceList" :data="state.spaceInfo" />
          </div>
        </template>
        <a-skeleton v-else :paragraph="{ rows: 12 }" active />
      </div>

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

          <div class="reservation">
            <div class="selectDate">
              <span>今天</span>
              <span>{{ ShowSelectedDateTime() }} </span>
              <img
                style="cursor: pointer"
                @click="state.spaceFilterShow = true"
                src="@/assets/seat/selectDate.svg"
                alt=""
              />
            </div>
            <p class="selectSeat">
              已选座位： <span>{{ state.spaceSelected?.no || "-" }}</span>
            </p>
          </div>
          <a-button
            class="reserve-btn"
            shape="round"
            type="primary"
            block
            @click="state.spaceRuleShow = true"
            :disabled="!state.spaceSelected?.id"
            >立即预约</a-button
          >
        </template>
        <a-skeleton v-else :paragraph="{ rows: 4 }" active />
      </div>
    </div>

    <a-modal
      width="40%"
      v-model:open="state.libraryInfoShow"
      title="空间详情"
      @ok="handleAppt"
      destroyOnClose
      okText="预约"
      cancelText="关闭"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{ size: 'middle' }"
      centered
    >
      <LibraryInfo v-if="state.libraryInfo?.id" :data="state.libraryInfo" />
    </a-modal>

    <a-modal
      width="35%"
      v-model:open="state.spaceFilterShow"
      title="选择时间"
      @ok="handleFilter"
      @cancel="handleFilter('cancel')"
      destroyOnClose
      okText="确认"
      cancelText="取消"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{
        size: 'middle',
        style: {
          background: (!state?.filterDate?.time && 'rgba(26,73,192,0.3)') || '',
          pointerEvents: (!state?.filterDate?.time && 'none') || '',
        },
      }"
      centered
    >
      <SpaceFilterDate
        v-if="state.spaceInfo?.date?.list?.length"
        :date="state.spaceInfo?.date"
        :initSearch="state.filterDate"
      />
    </a-modal>

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

    <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        visible: state.isShowFloorPlane,
        onVisibleChange: (v) => {
          state.isShowFloorPlane = v;
        },
      }"
      :src="state.floorPlaneMapSrc"
    />
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
    &:nth-child(2) {
      flex: 1;
    }
  }
}
</style>
