<script setup>
import { reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { showToast, showConfirmDialog } from "vant";
import { useRoute, useRouter } from "vue-router";
import {

  cancelSeatCollect,
  getOftenTime,
  getOftenTableList,
  getCollectTime,
  getCollectTableList,
} from "@/request/common";

import { getSpaceConfirm } from "@/request/seat.js";

import ShowInfoToast from "@/components/ShowInfoToast.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();

const emits = defineEmits(["handleShow"]);

const radioStyle = reactive({
  height: "18px",
  lineHeight: "18px",
  marginBottom: "16px",
  width: "46%",
});

const state = reactive({
  quickMode: "1",
  quickModeList: [
    { value: "1", label: $t("V4_seats") },
    { value: "2", label: $t("Space") },
  ],

  activeType: "collect",

  showAdsList: [],

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },

  spaceSelected: {},

  dateList: [],
  dateValue: "",

  timeList: [],
  timeValue: "",
});

watch(
  () => [state.activeType, state.quickMode],
  (v) => {
    // fetchSeatDate();
    fetch();
  }
);

watch(
  () => state.dateValue,
  (v) => {
    let findDate = state.dateList?.find((e) => e?.day == v);
    if (findDate) {
      state.timeList = findDate?.times || [];
      state.timeValue = state.timeList[0]?.show_time;
    }
  }
);

const initTime = () => {
  state.dateList = [];
  state.dateValue = "";

  state.timeList = [];
  state.timeValue = "";

  state.seatList = [];
  state.total = 0;
};

onMounted(() => {
  // fetchSeatDate();
  fetch();
});

const fetch = () => {
  initTime();
  console.log(state.quickMode, state.activeType);
  if (state.quickMode == 1) {
    // 座位
    // 获取开放日期
    fetchTimeList();
  } else {
    // 空间
    fetchTableList();
  }
};

const fetchTimeList = async () => {
  try {
    let params = {
      type: state.quickMode,
    };
    let res = null;
    if (state.activeType == "collect") {
      // 收藏
      res = await getCollectTime(params);
    } else {
      // 常用
      res = await getOftenTime(params);
    }
    console.log(res);
    if (res && res.code == 0 && res.data.length > 0) {
      state.dateList = res.data;
      state.dateValue = res?.data[0]?.day;
      setTimeout(() => {
        fetchTableList();
      }, 1);
    } else {
      initTime();
      // message.error(res?.msg || "获取开放日期失败");
    }
  } catch (error) {
    initTime();
    console.log(error);
  }
};

const fetchTableList = async () => {
  try {
    let params = null;
    if (state.quickMode == 1) {
      // 座位

      let findTimeRow = state.timeList?.find(
        (e) => e?.show_time == state.timeValue
      );
      params = {
        type: state.quickMode,
        day: state.dateValue,
        begin_time: findTimeRow?.start,
        end_time: findTimeRow?.end,
      };
    } else {
      // 空间
      params = {
        type: state.quickMode,
      };
    }
    let res = null;
    if (state.activeType == "collect") {
      // 收藏
      res = await getCollectTableList(params);
    } else {
      // 常用
      res = await getOftenTableList(params);
    }

    if (res.code == 0) {
      state.seatList = res.data;
      state.total = state.seatList.length;
    } else {
      state.seatList = [];
      state.total = 0;
      if (res && res.msg) {
        message.error(res.msg);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const onCancelCollect = async (record) => {
  showConfirmDialog({
    title: $t("V4_remove_from_favorites"),
    message: `${record.name_merge}:${record.space_name}`,
  }).then(async () => {
    try {
      let params = {
        space_id: record.space_id,
      };
      let res = await cancelSeatCollect(params);
      if (res.code == 0) {
        message.success(res.message);
      } else {
        message.error(res.message);
      }
      fetchTableList();
    } catch (error) {
      console.log(error);
    }
  });
};

const onApplyOrJumpDetail = (item) => {
  if (state.quickMode == 1) {
    // 座位
    // 只有reserve_type=1的可以直接调用预约接口，等于其他值的跳转到座位详情
    if (item.reserve_type == 1) {
      // 预约

      onSeatAppt(item);
    } else {
      // 跳转到座位详情
      router.push({
        path: "/mo/seat/appointment",
        query: {
          id: item?.area_id,
          date: state.dateValue,
        },
      });
    }
  } else {
    // 空间
    // 跳转到空间详情
    router.push({
      path: "/mo/space/apply",
      query: {
        id: item?.area_id,
      },
    });
  }
};

const onSeatAppt = async (row) => {
  try {
    let findTimeRow = state.timeList?.find(
      (e) => e?.show_time == state.timeValue
    );
    let params = {
      seat_id: row?.spaceId,
      segment: row?.segment,
      day: state.dateValue,
      startTime: findTimeRow.start,
      endTime: findTimeRow.end,
    };
    showConfirmDialog({
      title: `确认预约`,
      message: `${$t("Place")}：${row.name_merge}\n${$t("V4_seats")}：${row.space_name}\n${$t("Time")}：${params.day} ${findTimeRow?.show_time}`,
      messageAlign: "left",
    })
      .then(async () => {
        const res = await getSpaceConfirm(params);

        // showToast({
        //   duration: 1500,
        //   message: res.message,
        //   forbidClick: true,
        // });

        state.apptResult = {
          seatInfo: res?.data,
          show: true,
          title: res?.code == 0 ? $t("yuyue_success") : $t("V4_reservation_failed"),
          type: res?.code == 0 ? "success" : "error",
          msg: (res?.code != 0 && res?.message) || "",
        };
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {}
};

const onChangeDateOrTime = (e) => {
  if (state.quickMode == 1) {
    // 座位 模块  其实此层if可以去掉，因为时间选择模块 只有在座位模块下才显示
    fetchTableList();
  }
};


const handleShow = (v) => {
  state.apptResult.show = v;

  if (!v && state.apptResult?.type == "success") {
    if (route?.path == "/mo/current") {
      emits("handleShow");
    } else {
      router.push("/mo/current");
    }
  }
};
</script>
<template>
  <div class="commonAppt">
    <div class="cHeader">
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
    </div>

    <div class="apptCon">
      <div class="toggleLang">
        <div
          @click="state.activeType = 'collect'"
          :class="{ langActive: state.activeType == 'collect' }"
          class="langItem activeBtn"
        >
          {{ $t("V4_favorites") }}
        </div>
        <div
          @click="state.activeType = 'common'"
          :class="{ langActive: state.activeType == 'common' }"
          class="langItem activeBtn"
        >
          {{ $t("V4_frequently_used") }}
        </div>
      </div>
      <div
        class="filterTimes"
        v-if="!(state.quickMode === '2') && (state.dateList?.length && state.timeList?.length)"
      >
        <div class="timeItem">
          <span>{{ $t("Date") }}：</span>
          <div style="width: 100%">
            <a-radio-group
              v-model:value="state.dateValue"
              @change="onChangeDateOrTime"
            >
              <a-radio
                v-for="item in state.dateList"
                :style="radioStyle"
                :value="item?.day"
                >{{ item?.day }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
        <div class="timeItem" style="margin-top: 12px" >
          <span>{{$t("Time")}}：</span>
          <div style="width: 100%">
            <a-radio-group v-model:value="state.timeValue" @change="onChangeDateOrTime">
              <a-radio
                v-for="item in state.timeList"
                :style="radioStyle"
                :value="item?.show_time"
                >{{ item?.show_time }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
      </div>

      <div class="apptList">
        <div v-if="state?.seatList?.length > 0" v-for="item in state?.seatList" class="adsItem">
          <div class="addressInfo">
            <span>{{$t("Place")}}：{{ item?.name_merge }}</span>
            <img
              v-if="state.activeType == 'collect'"
              class="activeBtn"
              src="@/assets/seat/collectedIcon.svg"
              @click="onCancelCollect(item)"
              alt=""
            />
          </div>
          <div class="addressSeat" :class="{ action_space: state.quickMode == 2 }">
            <span v-if="state.quickMode == 1"
              >{{$t("V4_seats")}}：{{ item?.space_name }}</span
            >
            <div class="action" >
              <van-button
                
                size="small"
                round
                type="primary"
                @click="onApplyOrJumpDetail(item)"
              >
                {{ $t("Reservation") }}
              </van-button>
            </div>
          </div>
        </div>
        <a-empty :description="state.activeType == `collect` ? '无收藏的座位' : '无常用的座位'" v-else />
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
          <span>{{$t("Time")}}：</span>
          <span>{{ state.apptResult?.seatInfo?.time }}</span>
        </div>
        <div class="toastItem">
          <span>{{$t("Place")}}：</span>
          <span>{{ state.apptResult?.seatInfo?.seat }}</span>
        </div>
        <div class="toastItem">
          <span>{{$t("V4_seats")}}：</span>
          <span>{{ state.apptResult?.seatInfo?.no }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>{{$t("V4_reminder")}}：</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
      </template>
    </ShowInfoToast>
  </div>
</template>
<style lang="less" scoped>
.commonAppt {
  height: 100%;
  background-color: #fafafa;
  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
  }
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
  .apptCon {
    padding: 12px 14px;
    background-color: #fafafa;
    min-height: 350px;
    .filterTimes {
      margin-top: 20px;
      padding: 14px 16px;
      background: #ffffff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
      border-radius: 10px;
      .timeItem {
        display: flex;
        font-size: 14px;
        color: #616161;
        > span {
          flex-shrink: 0;
        }
        :deep(.ant-radio-group) {
          width: 100%;
        }
      }
    }
  }
}

.toggleLang {
  width: 60%;
  min-width: 200px;
  height: 36px;
  padding: 4px;
  background: #f1f1f1;
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .langItem {
    color: #868686;
    padding: 2px 16px;
    width: 50%;
    height: 28px;
    line-height: 26px;
    text-align: center;
  }
  .langActive {
    background: #ffffff;
    box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
    border-radius: 17px 17px 17px 17px;
    font-weight: bold;
    color: #1f56e1;
  }
}
.apptList {
  font-size: 14px;
  color: #616161;
  .adsItem {
    width: 100%;
    padding: 14px 16px;
    margin-top: 12px;
    background: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
    border-radius: 10px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:last-child {
        margin-top: 12px;
      }
    }
    span {
      font-size: 14px;
    }

    .action {
      button {
        height: 26px;
        min-width: 50px;
      }
    }
    .action_space {
      justify-content: flex-end;
    }
  }
}
</style>
