<route>
    {
      meta: {
        showHead: false,
        showLeftBack:true,
        title:'Space_Reservation_Record',
        showTabbar:true
      }
    }
</route>
<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import SeatRecordDetails from "@/mobile/index/profile/seat-record-details.vue";
// import MySeatRecordCom from "@/components/MySeatRecordCom.vue";
import { getSeatRecordList, getSeatRenegeList } from "@/request/sear-record";
import { getQueryTree, getQuerySeat } from "@/request/seat";
import { exchangeDateTime } from "@/utils";

const router = useRouter();
const state = reactive({
  showItemDetails: false,
  itemDetails: {},

  activeKey: "1",
  activeKeyList: [
    { value: "1", label: $t("H_Seat") },
    { value: "3", label: $t("V4_study_seat") },
    { value: "4", label: $t("V4_seat_KYZW") },
  ],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],

  quickMode: 1,
  quickModeList: [
    { value: 1, label: $t("visitor_Reservation_List") },
    { value: 2, label: "违约记录" },
    { value: 3, label: $t("Authority_check") },
  ],
  status_name: "预约成功",

  refreshing: false,
  loading: false,
  finished: true,

  queryResult: {
    isShow: false,
    location: "",
    currentPeriod: {
      period: "",
      status: "",
    },
    nextPeriod: {
      period: "",
      status: "",
    },
  },

  roomValue: "",
  floorValue: "",
  areaValue: "",

  queryTree: [],
  floorList: [],
  areaList: [],
});

watch(
  () => state.activeKey,
  () => {
    if (state.quickMode == "3") {
      state.quickMode = "1";
    }
    state.currentPage = 1;
    fetch();
  }
);

const onChangeQMode = (row) => {
  if (state.activeKey == "1") {
    // 普通座位 下 不能点击 权限查询
    if (row?.value == "3") return;
  }
  state.quickMode = row?.value;
  fetch();
};

// 计算属性，根据 activeKey 动态返回 quickModeList
const filteredQuickModeList = computed(() => {
  if (state.activeKey === "1") {
    // 如果 activeKey 为 1，返回前两条数据
    return state.quickModeList.slice(0, 2);
  }
  // 否则返回全部数据
  return state.quickModeList;
});

const fetch = () => {
  if (state.quickMode === 1) {
    // 预约记录
    fetchSeatRecordList();
  } else if (state.quickMode === 2) {
    // 违约记录
    fetchSeatRenegeList();
  } else if (state.quickMode === 3) {
    // 权限查询
  }
};

onMounted(() => {
  fetch();
  fetchQueryTree();
});

const onRefresh = () => {
  state.currentPage = 1;
  fetch();
};
const onLoad = () => {
  state.currentPage++;
  fetch();
};

const fetchSeatRecordList = async () => {
  try {
    let params = {
      type: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getSeatRecordList(params);
    state.loading = false;
    state.refreshing = false;
    if (res?.code === 0) {
      if (state.currentPage === 1) {
        state.data = res?.data?.data || [];
      } else {
        state.data.push(...res?.data?.data);
      }
      state.total = res?.data?.total;
      state.finished = res?.data?.current_page >= res?.data?.last_page || true;
    } else {
      state.data = [];
      state.finished = true;
      state.total = 0;
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    console.log(error);
  }
};
const fetchSeatRenegeList = async () => {
  try {
    let params = {
      type: state.activeKey,
    };
    const res = await getSeatRenegeList(params);
    state.loading = false;
    state.refreshing = false;
    if (res?.code === 0) {
      if (state.currentPage === 1) {
        state.data = res?.data?.data || [];
      } else {
        state.data.push(...res?.data?.data);
      }
      state.total = res?.data?.total;
      state.finished = res?.data?.current_page >= res?.data?.last_page || true;
    } else {
      state.data = [];
      state.finished = true;
      state.total = 0;
    }
  } catch (error) {
    state.loading = false;
    state.refreshing = false;
    state.finished = true;
    state.data = [];
    state.total = 0;
    console.log(error);
  }
};

const fetchQueryTree = async () => {
  try {
    const res = await getQueryTree();
    if (res?.code === 0) {
      state.queryTree = res?.data || [];

      state.roomValue = res?.data?.[0]?.id;

      state.floorList = state.queryTree[0]?.children || [];
      state.floorValue = state.floorList[0]?.id;

      state.areaList = state.floorList[0]?.children || [];
      state.areaValue = state.areaList[0]?.id;
    }
  } catch (error) {
    console.log(error);
  }
};

const onClickItem = (item) => {
  state.showItemDetails = true;

  state.itemDetails = item;
  state.itemDetails.activeKey = state.activeKey;
  console.log(state.itemDetails);
};

const onChangeRoom = (value) => {
  state.floorList =
    state.queryTree.find((item) => item.id === value)?.children || [];
  state.floorValue = state.floorList[0]?.id;

  state.areaList = state.floorList[0]?.children || [];
  state.areaValue = state.areaList[0]?.id;
};
const onChangeFloor = (value) => {
  state.areaList =
    state.floorList.find((item) => item.id === value)?.children || [];
  state.areaValue = state.areaList[0]?.id;
};

const onQueryConfirm = async () => {
  try {
    const roomStr = state.queryTree.find(
      (item) => item.id === state.roomValue
    )?.name;
    const floorStr = state.floorList.find(
      (item) => item.id === state.floorValue
    )?.name;
    const areaStr = state.areaList.find(
      (item) => item.id === state.areaValue
    )?.name;
    const location = `${roomStr}-${floorStr}-${areaStr}`;

    state.queryResult.location = location;

    let params = {
      area: state.areaValue,
    };
    const res = await getQuerySeat(params);
    if (res?.code === 0) {
      state.queryResult.isShow = true;
      let data = res?.data || [];
      for (const [index, item] of data.entries()) {
        if (index == 0) {
          state.queryResult.currentPeriod.period = `${item.startDay}至${item.endDay}`;
          state.queryResult.currentPeriod.status = item.isvalid;
        } else if (index == 1) {
          state.queryResult.nextPeriod.period = `${item.startDay}至${item.endDay}`;
          state.queryResult.nextPeriod.status = item.isvalid;
        }
      }
      state.isModalVisibleForQuery = false;
    } else {
      state.queryResult.isShow = false;
      showToast({
        message: res?.message || res?.msg,
      });
    }
  } catch (e) {
    state.queryResult.isShow = false;
    console.log(e);
  }
};
</script>
<template>
  <div class="area-record">
    <div class="cHeader">
      <div class="quickMode">
        <div
          v-for="item in state.activeKeyList"
          :key="item.label"
          class="item activeBtn"
          :class="{ itemActive: item?.value == state.activeKey }"
          @click="state.activeKey = item?.value"
        >
          {{ item?.label }}
        </div>
      </div>
    </div>
    <div
      class="quickBtns margin_top_10"
      :class="{
        width_180: state.activeKey == '1',
        width_270: state.activeKey != '1',
      }"
    >
      <div
        v-for="item in filteredQuickModeList"
        :key="item.label"
        class="item activeBtn"
        :class="{ itemActive: item?.value == state.quickMode }"
        style="font-size: 14px"
        @click="onChangeQMode(item)"
      >
        {{ item?.label }}
      </div>
    </div>
    <div class="refreshCon">
      <van-pull-refresh
        v-if="state.quickMode != 3"
        v-model="state.refreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-if="state.data.length > 0"
          v-model:loading="state.loading"
          :finished="state.finished"
          :finished-text="$t('No_more')"
          @load="onLoad"
        >
          <div
            v-for="item in state.data"
            :key="item?.id"
            class="item_list"
            @click="onClickItem(item)"
          >
            <div class="info_item margin_bottom">
              <img
                src="@/assets/my/mobile_seat_record_seat.svg"
                alt="Location"
              />
              <span>{{ item.nameMerge }} : {{ item.name }}</span>
            </div>
            <div class="info_item">
              <img src="@/assets/event/time.svg" alt="Time" />
              <template v-if="state.quickMode == '1'">
                <!-- 预约记录 -->
                <span v-if="state.activeKey == '1'"
                  >{{ exchangeDateTime(item.beginTime, 3) }} ~
                  {{ exchangeDateTime(item.endTime, 8) }}</span
                >
                <span v-else
                  >{{ exchangeDateTime(item.beginTime, 2) }} ~
                  {{ exchangeDateTime(item.endTime, 40) }}</span
                >
              </template>
              <template v-else>
                <!-- 违约记录 -->
                <span>{{ item.renegeTime }}</span>
              </template>

              <div v-if="item.status_name === '预约成功'">
                <a-button type="primary" shape="round" size="small" block>{{
                  $t("Cancel")
                }}</a-button>
              </div>
            </div>

            <!-- 
                  预约成功			2、9
                  预约待审核		1、32	
                  待邀			    21
                  草稿			    31
                  使用中			  3、11、33
                  已结束			  4、8、12、34、35
                  已取消			  6
                  状态异常			其它
                -->
            <div
              v-if="state.activeKey == '1'"
              class="rightBadge basicsBadge"
              :class="{
                status_success: item.status === '2' || item.status === '9',
                status_cancel: item.status === '6',
                status_in_progress:
                  item.status === '3' ||
                  item.status === '11' ||
                  item.status === '33',
                status_end:
                  item.status === '4' ||
                  item.status === '8' ||
                  item.status === '12' ||
                  item.status === '34' ||
                  item.status === '35',
                status_no_sign: item.status_name === '未签到',
                status_abnormal:
                  item.status_name === '状态异常' || item.status == '4',
              }"
            >
              {{ item.status_name }}
            </div>
            <!-- 考研/研习座位
                  已预约    1   绿色 可取消
                  已取消    2   灰色
                  暂停      3   橙色
                  已结束    4   灰色
                  状态异常  其它 灰色
                -->
            <div
              v-else
              class="rightBadge basicsBadge"
              :class="{
                status_success: item.status === '1',
                status_cancel: item.status === '2' || item.status === '4',
                status_abnormal:
                  item.status_name === '状态异常' || item.status == '4',
              }"
            >
              {{ item.status_name }}
            </div>
          </div>
        </van-list>
        <div style="height: 100%" v-else>
          <a-empty />
        </div>
      </van-pull-refresh>
    </div>

    <div v-if="state.quickMode == 3" class="query_result">
      <div class="query_result_info">
        <div class="query_result_info_item" v-if="state.queryResult.isShow">
          {{ $t("Query_Results") }}<span class="span_gray">(请点击查询)</span>
          <div class="margin10 query_result_info_item_text">
            {{ $t("Current") }}（{{ state.queryResult.currentPeriod.period }}）
            {{ $t("Reservation_permission") }}:<span
              :class="
                state.queryResult.currentPeriod.status == 1
                  ? 'status-success'
                  : 'text-default'
              "
              >{{
                state.queryResult.currentPeriod.status == 1
                  ? $t("Authorized_by")
                  : $t("Unauthorized")
              }}
            </span>
          </div>
          <div class="query_result_info_item_text">
            {{ $t("Next_time") }}（{{ state.queryResult.nextPeriod.period }}）
            {{ $t("Reservation_permission") }}:<span
              :class="
                state.queryResult.nextPeriod.status == 1
                  ? 'status-success'
                  : 'text-default'
              "
              >{{
                state.queryResult.nextPeriod.status == 1
                  ? $t("Authorized_by")
                  : $t("Unauthorized")
              }}
            </span>
          </div>
        </div>

        <div class="filterCon">
          <div class="filterScr">
            <div class="filterFilter">{{ $t("Library") }}</div>
            <div class="fiterItem">
              <a-radio-group
                v-model:value="state.roomValue"
                @change="onChangeRoom"
              >
                <a-radio
                  class="width_half"
                  v-for="item in state.queryTree"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
            <div class="filterFilter">{{ $t("Floor") }}</div>
            <div class="fiterItem">
              <a-radio-group
                v-model:value="state.floorValue"
                @change="onChangeFloor"
              >
                <a-radio
                  class="width_half"
                  v-for="item in state.floorList"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
            <div class="filterFilter">{{ $t("Area") }}</div>
            <div class="fiterItem">
              <a-radio-group
                v-model:value="state.areaValue"
              >
                <a-radio
                  class="width_half"
                  v-for="item in state.areaList"
                  :value="item?.id"
                  :key="item?.id"
                  >{{ item?.name }}</a-radio
                >
              </a-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div style="margin: 15px 10px">
        <a-button type="primary" shape="round" block @click="onQueryConfirm">{{
          $t("Visitor_query")
        }}</a-button>
      </div>
    </div>

    <van-popup
      v-model:show="state.showItemDetails"
      position="bottom"
      :style="{ height: '100%' }"
      destroy-on-close
    >
      <div class="libraryPop">
        <SeatRecordDetails :data="state.itemDetails" />
        <div class="bottomAction">
          <van-button
            round
            block
            type="default"
            @click="state.showItemDetails = false"
          >
            <img src="@/assets/seat/moBackBtn.svg" alt="" />
            {{ $t("Return") }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style lang="less" scoped>
.area-record {
  height: 100%;
  background-color: #fafafa;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .top_tabs {
    background-color: #fff;
    padding-left: 10px !important;
  }
  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
  }
  .quickMode {
    display: flex;
    gap: 20px;
    .item {
      padding-bottom: 10px;
      font-size: 15px;
      color: #616161;

      &.itemActive {
        color: #202020;
        border-bottom: 2px solid #1a49c0;
      }
    }
  }
  .margin_top_10 {
    margin-top: 10px;
  }
  .width_180 {
    margin-left: 10px;
    width: 200px;
  }
  .width_270 {
    margin-left: 10px;
    width: 280px;
  }
  .item_list {
    position: relative;
    margin: 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    .info_item {
      display: flex;
      align-items: flex-start;

      img {
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
      span {
        flex: 8;
        flex-wrap: wrap;
        font-size: 13px;
        color: rgba(32, 32, 32, 1);
      }
      div {
        align-self: flex-end;

        flex: 2;
      }
    }
    .margin_bottom {
      margin-bottom: 16px;
    }
    .rightBadge {
      position: absolute;
      right: 0;
      top: 0;
    }
    .basicsBadge {
      padding: 3px 8px;
      border-radius: 0px 6px 0px 6px;
      font-size: 10px;
      background-color: rgba(243, 243, 243, 1);
    }
    .status_success {
      background-color: rgba(78, 201, 91, 0.1);
      color: rgba(78, 201, 91, 1);
    }
    .status_cancel,
    .status_end {
      background-color: rgba(134, 134, 134, 0.1);
      color: rgba(32, 32, 32, 0.3);
    }
    .status_in_progress {
      background: rgba(233, 239, 252, 1);
      color: rgba(31, 86, 225, 1);
    }
    .status_no_sign {
      background-color: rgba(223, 31, 31, 0.07);
      color: rgba(223, 31, 31, 1);
    }
    .status_abnormal {
      background-color: rgba(243, 116, 0, 0.1);
      color: rgba(243, 116, 0, 1);
    }
  }
  .query_result {
    margin-top: 20px;
    height: 80vh;

    display: flex;
    flex-direction: column;
    .query_result_info {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 10px;
      .query_result_info_item {
        padding: 10px;
        background-color: #fff;
        font-size: 14px;
        color: rgba(32, 32, 32, 1);
        padding-left: 20px;
        .margin10 {
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .query_result_info_item_text {
          font-size: 13px;
          color: rgba(97, 97, 97, 1);
          .status-success {
            color: #52c41a;
          }
          .text-default {
            color: #242424;
          }
        }

        .span_gray {
          color: rgba(160, 160, 160, 1);
          font-size: 14px;
        }
      }
      .filterCon {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        padding: 10px;
        background-color: #fff;
        .filterScr {
          flex: 1;
          overflow-y: auto;
        }
        .filterFilter {
          margin-bottom: 24px;
          background: rgba(97, 97, 97, 0.05);
          border-radius: 0px 0px 0px 0px;
          padding: 2px 10px;
          color: rgba(97, 97, 97, 1);
        }
        .fiterItem {
          user-select: none;
          padding: 0 20px;
          margin-bottom: 20px;
          .ant-checkbox-group,
          .ant-radio-group {
            width: 100%;
            .ant-radio-wrapper,
            .ant-checkbox-wrapper {
              width: 29%;
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
          .width_half {
            width: 49% !important;
            span {
              display: inline-block;
              width: 100%;
            }
          }
        }
      }
    }
  }
}

.libraryPop {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fafafa;

  :deep(.area-record-details) {
    flex: 1;
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

:deep(.ant-btn-sm) {
  font-size: 12px !important;
}

.refreshCon {
  flex: 1;
  .van-pull-refresh {
    height: 100%;
  }
}
</style>
