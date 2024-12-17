<script setup>
import { reactive, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { showToast, showConfirmDialog } from "vant";
import { useRoute, useRouter } from "vue-router";
import {
  getSeatAreaDate,
  getSeatOftenDate,
  getSeatCollectList,
  getSeatOftenList,
  cancelSeatCollect,
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
  quickMode: "0",
  quickModeList: [
    { value: "0", label: "座位" },
    // { value: "1", label: "空间" },
  ],

  date: "",
  dateList: [],
  timeVal: "",
  timeList: [],
  activeType: "collect",

  showAdsList: [],

  apptResult: {
    show: false,
    title: "预约成功~~",
    type: "success",
  },

  spaceSelected: {},
});

watch(
  () => [state.activeType, state.quickMode],
  (v) => {
    fetchSeatDate();
  }
);

watch(
  () => state.date,
  (v) => {
    let findDate = state.dateList?.find((e) => e?.day == v);
    if (findDate) {
      state.timeList = findDate?.opentimes || [];
      state.timeVal = state.timeList[0]?.Times;
    }
  }
);
onMounted(() => {
  fetchSeatDate();
});

const onApptSeat = async (row) => {
  try {
    let findTimeRow = state.timeList?.find((e) => e?.Times == state.timeVal);
    let params = {
      seat_id: row?.spaceId,
      segment: row?.segment,
      day: state.date,
      startTime: findTimeRow.startTime,
      endTime: findTimeRow.endTime,
    };
    showConfirmDialog({
      title: `确认预约`,
      message: `地点：${row.nameMerge}\n座位：${row.spacename}\n时间：${params.day} ${findTimeRow?.Times}`,
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
          title: res?.code == 0 ? "预约成功" : "预约失败",
          type: res?.code == 0 ? "success" : "error",
          msg: (res?.code != 0 && res?.message) || "",
        };
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {}
};

const fetchSeatDate = async () => {
  try {
    let res = null;
    state.showAdsList = [];

    if (state.activeType == "collect") {
      // 收藏
      res = await getSeatAreaDate();
    } else {
      // 常用
      res = await getSeatOftenDate();
    }
    if (res.code != 0) {
      state.showAdsList = [];
      message.error(res?.msg);
      return false;
    }

    state.dateList = res.data;
    state.date = res?.data[0]?.day;
    setTimeout(() => {
      state.dateList?.length && fetchSeatList();
    }, 1);
  } catch (error) {
    message.error(`网络错误~`);
  }
};

const fetchSeatList = async () => {
  try {
    let findTimeRow = state.timeList?.find((e) => e?.Times == state.timeVal);
    let params = {
      day: state.date,
      startTime: findTimeRow.startTime,
      endTime: findTimeRow.endTime,
    };

    let res = null;
    if (state.activeType == "collect") {
      // 收藏
      res = await getSeatCollectList(params);
    } else {
      // 常用
      res = await getSeatOftenList(params);
    }
    state.showAdsList = res.data || [];
  } catch (error) {
    state.showAdsList = res.data || [];
  }
};
const onChange = () => {
  fetchSeatList();
};

const fetchDeleteCollect = async (id) => {
  try {
    let params = {
      spaceId: id,
    };
    let res = await cancelSeatCollect(params);
    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res.msg,
      });
      return false;
    }

    showToast({
      duration: 800,
      message: res.msg,
      forbidClick: true,
    });

    setTimeout(() => {
      fetchSeatList();
    }, 800);
  } catch (e) {}
};

const ShowSelectedDateTime = () => {
  let findTimeRow = state.timeList?.find((e) => e?.Times == state.timeVal);

  return `${state.date} ${findTimeRow?.Times}`;
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

    <div class="apptCon" v-if="state.dateList?.length">
      <div class="toggleLang">
        <div
          @click="state.activeType = 'collect'"
          :class="{ langActive: state.activeType == 'collect' }"
          class="langItem activeBtn"
        >
          收藏
        </div>
        <div
          @click="state.activeType = 'common'"
          :class="{ langActive: state.activeType == 'common' }"
          class="langItem activeBtn"
        >
          常用
        </div>
      </div>
      <div class="filterTimes">
        <div class="timeItem">
          <span>日期：</span>
          <div style="width: 100%">
            <a-radio-group v-model:value="state.date" @change="onChange">
              <a-radio
                v-for="item in state.dateList"
                :style="radioStyle"
                :value="item?.day"
                >{{ item?.day }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
        <div class="timeItem" style="margin-top: 12px">
          <span>时间：</span>
          <div style="width: 100%">
            <a-radio-group v-model:value="state.timeVal" @change="onChange">
              <a-radio
                v-for="item in state.timeList"
                :style="radioStyle"
                :value="item?.Times"
                >{{ item?.Times }}</a-radio
              >
            </a-radio-group>
          </div>
        </div>
      </div>

      <div class="apptList">
        <div v-for="item in state?.showAdsList" class="adsItem">
          <div class="addressInfo">
            <span>地点：{{ item?.nameMerge }}</span>
            <img
              v-if="state.activeType == 'collect'"
              class="activeBtn"
              src="@/assets/seat/collectedIcon.svg"
              @click="fetchDeleteCollect(item?.spaceId)"
              alt=""
            />
          </div>
          <div class="addressSeat">
            <span>座位：{{ item?.spaceId }}</span>
            <div class="action">
              <van-button
                size="small"
                round
                type="primary"
                @click="onApptSeat(item)"
              >
                预约
              </van-button>
            </div>
          </div>
        </div>
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
          <span>时间：</span>
          <span>{{ state.apptResult?.seatInfo?.time }}</span>
        </div>
        <div class="toastItem">
          <span>地点：</span>
          <span>{{ state.apptResult?.seatInfo?.seat }}</span>
        </div>
        <div class="toastItem">
          <span>座位：</span>
          <span>{{ state.apptResult?.seatInfo?.no }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>提醒：</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
      </template>
    </ShowInfoToast>
  </div>
</template>
<style lang="less" scoped>
.commonAppt {
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
  }
}
</style>
