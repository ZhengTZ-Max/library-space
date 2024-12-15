<script setup>
import { reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import { showToast, showConfirmDialog, showImagePreview } from "vant";

import { exchangeDateTime } from "@/utils";

import {
  fetchCancelSeat,
  fetchSeatSignin,
  fetchSeatStudySign,
  fetchCancelStudyCancel,
  fetchSeatleave,
  fetchSeatCheckout,
  SpaceSignOut,
  SpaceCancel,
  cancelBook,
} from "@/request/home";

import { getSpaceMap, getSpaceSeat } from "@/request/seat";

import SpaceSeatMap from "@/components/SpaceSeat/SpaceSeatMap.vue";

const store = useStore();
const lang = computed(() => store.state.lang);
const systemMode = computed(() => store.state.systemMode);
const emit = defineEmits(["getList", "getSeatImgInfo"]);
const isDragging = ref(false);
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

const state = reactive({
  spaceList: [],
  spaceInfo: [],
  spaceSelected: [],

  showSpaceMap: false,
});

const onViewFloor = (data) => {
  data?.image_url &&
    showImagePreview({
      images: [data?.image_url],
      closeable: true,
      closeIconPosition: "top-left",
    });
};
const fetchReviewPosition = async (row) => {
  try {
    let infoParams = {
      id: row?.area_id,
    };

    let listParams = {
      id: row?.area_id,
      day: exchangeDateTime(new Date(), 2),
      start_time: exchangeDateTime(row?.beginTime, 33),
      end_time: exchangeDateTime(row?.endTime, 33),
    };

    let infoData = await getSpaceMap(infoParams);
    let listData = await getSpaceSeat(listParams);
    state.spaceInfo = infoData?.data || {};
    state.spaceList = listData?.data?.list || [];
    state.spaceSelected = state.spaceList?.find((e) => e?.id == row?.space);

    state.showSpaceMap = true;
  } catch (e) {
    console.log(e);
  }
};

const onCancel = (row) => {
  try {
    let res;
    let params = {
      id: row.id,
    };
    let message = `${row.areaName}:${row.no}`;
    if (row?.type == 2)
      message = `${row.areaName} ${lang == "zh" ? "的预约" : "Appointment"}？`;
    if ([14, 15, 16]?.includes(row?.type))
      message = `${row.nameMerge} ${lang == "zh" ? "的预约" : "Appointment"}？`;
    if (row?.type == 13)
      message = `${row.title} ${lang == "zh" ? "的预约" : "Appointment"}？`;

    if (row?.only_cancel == 1) {
      message += `\n\n${row?.only_cancel_text}`;
    }
    showConfirmDialog({
      title: $t("cancelappointment"),
      message,
    })
      .then(async () => {
        // if (row?.type == "3") {
        //   cancelAppointment(row?.id);
        //   return false;
        // } else if (row?.type == "5") {
        //   handleSeat(row?.id);
        //   return false;
        // } else if (row?.type == "2") {
        //   handleCancelV2(row?.id);
        //   return false;
        // } else if (row?.type == "14") {
        //   handleCancelLock(row?.id);
        //   return false;
        // } else if (row?.type == "13") {
        //   handleCancelActivity(row?.id, row?.bookTimeId);
        //   return false;
        // }
        if (row?.type == 1) {
          res = await fetchCancelSeat(params);
        } else if (row?.type == 3 || row?.type == 4) {
          res = await fetchCancelStudyCancel(params);
        } else if (row?.type == 2) {
          res = await SpaceCancel(params);
        } else if ([14, 15, 16]?.includes(row?.type)) {
          params = {
            orderId: row?.id,
          };
          res = await cancelBook(params);
        }

        if (res.code != 0) {
          showToast({
            duration: 3000,
            message: res?.message || res?.msg,
          });
          return false;
        }
        showToast({
          message: res?.message || res?.msg,
        });
        resetSubscribeList();
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {
    console.log(e);
  }
};

const handleSign = async (row) => {
  try {
    let res;
    if (row?.type == 1) {
      res = await fetchSeatSignin({ id: row.id });
    } else if (row?.type == 3 || row?.type == 4) {
      res = await fetchSeatStudySign({ seat_id: row.id });
    }

    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res.message,
      });
      return false;
    }
    showToast({
      message: res.message,
    });
    resetSubscribeList();
  } catch (e) {
    console.log(e);
  }
};

const handleLeave = async (row) => {
  try {
    let title = store?.state?.lang?.currentLang?.rightback || "临时离开";
    let message = `${
      store?.state?.lang?.currentLang?.popup_window_Confirm || "是否确认"
    } ${title}？`;

    showConfirmDialog({
      title,
      message,
    })
      .then(async () => {
        const res = await fetchSeatleave({ id: row.id });
        if (res.code != 0) {
          showToast({
            message: res.message,
          });
          return false;
        }
        showToast({
          message: res.message,
        });
        resetSubscribeList();
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {
    console.log(e);
  }
};

const handleCheckout = async (row) => {
  try {
    let title = store?.state?.lang?.currentLang?.leave || "完全离开";
    let message = `${
      store?.state?.lang?.currentLang?.popup_window_Confirm || "是否确认"
    } ${title}？`;
    showConfirmDialog({
      title,
      message,
    })
      .then(async () => {
        const res = await fetchSeatCheckout({ id: row.id });
        if (res.code != 0) {
          showToast({
            message: res.message,
          });
          return false;
        }
        showToast({
          message: res.message,
        });
        resetSubscribeList();
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {
    console.log(e);
  }
};

const resetSubscribeList = () => {
  setTimeout(() => {
    emit("getList");
  }, 800);
};

const checkShow = (row, type) => {
  // let notice = store?.state?.config?.config?.notice;
  let isShow = false;
  switch (type) {
    case "leave":
      {
        // isShow = notice?.rightback == 1 && row.flag_out == 1;
        isShow = row?.flag_out == 1;
      }
      break;
    case "all-leave":
      {
        // isShow = notice?.leave == 1 && row.flag_out == 1;
        isShow = row?.flag_leave == 1 || row?.flag_out == 1;
      }
      break;
    case "sign":
      {
        // isShow = notice?.signin == 1 && row.flag_in == 1 && row.flag_leave != 1;
        isShow = row.flag_in == 1 && row.flag_leave != 1;
      }
      break;
    case "back-sign":
      {
        // isShow = notice?.rightback == 1 && row.flag_leave == 1;
        isShow = row.flag_leave == 1;
      }
      break;
    case "cancel":
      {
        isShow = row.oksign == 1;
      }
      break;
    case "renewal":
      {
        isShow = row.xuzuoflag == 1;
      }
      break;
    default:
      {
        isShow = false;
      }
      break;
  }
  return isShow;
};

const showStudyText = (row) => {
  let str = "";
  let color = "";

  if (row?.earlierPeriodsSignIn == -1) {
    str = "预约未开始";
    color = "var(--van-primary-color)";
  } else if (row?.earlierPeriodsSignIn == 1) {
    str = "当日已签到";
    color = "green";
  } else if (row?.earlierPeriodsSignIn == 2) {
    str = "当日已违约";
    color = "#e58100";
  } else if (row?.earlierPeriodsSignIn == 0) {
    str = "当日未签到";
    color = "#e58100";
  }

  return { str, color };
};

const handleMouseDown = () => {
  isDragging.value = false; // 重置拖动状态
};

const handleMouseMove = () => {
  isDragging.value = true; // 标记为拖动
};

const handleClick = () => {
  if (!isDragging.value) {
    // 只有未拖动时才执行点击逻辑
    state.showSpaceMap = false;
  }
};

const handleSignOut = async (data) => {
  try {
    let title = store?.state?.lang?.currentLang?.leave || "结束使用";
    let message = `${
      store?.state?.lang?.currentLang?.popup_window_Confirm || "是否确认"
    } ${title}？`;
    showConfirmDialog({
      title,
      message,
    })
      .then(async () => {
        const res = await SpaceSignOut({ id: data.id });
        if (res.code != 0) {
          showToast({
            message: res.message,
          });
          return false;
        }
        showToast({
          message: res.message,
        });
        resetSubscribeList();
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <div class="AppointmentItem">
    <template v-if="[1, 3, 4]?.includes(data?.type)">
      <div class="header">
        <img src="@/assets/home/appSeatIcon.svg" alt="" srcset="" />
        <span>已约座位</span>
        <div class="seatType">
          {{
            data?.type == 1
              ? "普通座位"
              : data?.type == 3
              ? "研习座位"
              : "考研座位"
          }}
        </div>
      </div>

      <div class="intro">
        <div class="introFirst">
          <p>地点：{{ data?.areaName }}</p>
          <!-- <div class="areaView">
            区域平面图
            <img src="@/assets/home/rightIcon.svg" alt="" />
          </div> -->
        </div>
        <div class="seatCon">
          <span>座位：{{ data?.no }}</span>
          <span class="viewPosition" @click="fetchReviewPosition(data)"
            >查看位置</span
          >
        </div>
        <div>时间：{{ data?.showTime }}</div>
        <div class="action">
          <div
            v-if="
              data.flag_in == 1 &&
              data.flag_leave == 0 &&
              [1, 2, 5, 6, 7].includes(Number(data.type))
            "
            class="tips"
          >
            {{ `${$t("Please")} ${data.signintime} ${$t("Sign_in_before")}` }}
            <!-- 时间：{{ data?.signintime }} -->
          </div>
          <div
            v-else-if="
              data.flag_in == 1 && data.flag_leave == 1 && data.type == 1
            "
            class="tips"
          >
            {{ `${$t("Please")} ${data.signintime} ${$t("Sign_in_before")}` }}
            <!-- 时间：{{ data?.signintime }} -->
          </div>
          <div v-else>
            <div
              class="clock"
              v-if="
                data?.use_time !== 0 &&
                data?.type != 13 &&
                data?.earlierPeriods == 0
              "
            >
              <img src="@/assets/home/useTime.svg" alt="" />
              <span>
                {{ `${$t("Already_used")} ${data?.use_time} ${$t("Minutes")}` }}
              </span>
            </div>
          </div>
          <div class="actionBtn">
            <van-button
              v-if="checkShow(data, 'sign')"
              class="btn sign"
              style="background-color: var(--primary-color)"
              @click.stop="handleSign(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "签到" }}
            </van-button>

            <van-button
              class="btn sign"
              style="background: #35539e"
              v-if="checkShow(data, 'back-sign')"
              @click.stop="handleSign(data)"
            >
              {{ store?.state?.lang?.currentLang?.return_signin || "返回签到" }}
            </van-button>

            <van-button
              class="btn"
              style="background: #35539e"
              v-if="checkShow(data, 'leave')"
              @click.stop="handleLeave(data)"
            >
              {{ store?.state?.lang?.currentLang?.rightback || "临时离开" }}
            </van-button>
            <van-button
              class="btn all-leave"
              style="background: #e58100"
              v-if="checkShow(data, 'all-leave')"
              @click.stop="handleCheckout(data)"
            >
              {{ store?.state?.lang?.currentLang?.leave || "完全离开" }}
            </van-button>

            <van-button
              v-if="checkShow(data, 'cancel')"
              class="btn cancel"
              plain
              type="primary"
              color="#F28800"
              @click.stop="onCancel(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "取消" }}
            </van-button>
          </div>
        </div>
      </div>
    </template>

    <template v-if="[2]?.includes(data?.type)">
      <div class="header">
        <img
          style="transform: translateY(-2px)"
          src="@/assets/home/appSpaceIcon.svg"
          alt=""
          srcset=""
        />
        <span>已约空间</span>
        <div class="seatType spaceType">
          {{
            data?.type == 2
              ? "研讨室"
              : data?.type == 3
              ? "研习座位"
              : "考研座位"
          }}
        </div>
      </div>

      <div class="intro">
        <!-- <div class="introFirst">
          <p>地点：{{ data?.areaName }}</p>
        </div> -->
        <div class="seatCon">
          <span>地点：{{ data?.areaName }}</span>

          <span class="viewPosition" @click="onViewFloor(data)">查看位置</span>
        </div>
        <div class="applyTime"><span>时间：</span>{{ data?.showTime }}</div>
        <div class="action">
          <div
            v-if="
              data.flag_in == 1 &&
              data.flag_leave == 0 &&
              [1, 2, 5, 6, 7].includes(Number(data.type))
            "
            class="tips"
          >
            <!-- {{ `${$t("Please")} ${data.signintime} ${$t("Sign_in_before")}` }} -->
          </div>
          <div class="actionBtn">
            <!-- <button
            v-else-if="item?.status == '3'"
            class="btn cancel-appointment"
            style="background: #e58100"
            @click.stop="handleSignOut(item)"
          >
            {{ store?.state?.lang?.lang == "zh" ? "结束使用" : "End use" }}
          </button> -->
            <van-button
              v-if="[3, 11, 12]?.includes(Number(data?.status))"
              class="btn cancel"
              plain
              type="primary"
              color="#e58100"
              @click.stop="handleSignOut(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "结束使用" }}
            </van-button>
            <van-button
              v-else-if="data?.earlierPeriods > 0"
              class="btn cancel"
              plain
              type="primary"
              color="#F28800"
              @click.stop="onCancel(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "取消" }}
            </van-button>
            <van-button
              v-else-if="checkShow(data, 'cancel')"
              class="btn cancel"
              plain
              type="primary"
              color="#F28800"
              @click.stop="onCancel(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "取消" }}
            </van-button>
          </div>
        </div>
      </div>
    </template>

    <template v-if="[14, 15, 16]?.includes(data?.type)">
      <div class="header">
        <img
          style="transform: translateY(-2px)"
          src="@/assets/home/appSpaceIcon.svg"
          alt=""
          srcset=""
        />
        <span>已约书柜</span>
        <div class="seatType spaceType">存书柜</div>
      </div>

      <div class="intro">
        <!-- <div class="introFirst">
          <p>地点：{{ data?.areaName }}</p>
        </div> -->
        <div class="seatCon">
          <span>地点：{{ data?.nameMerge }}</span>

          <span class="viewPosition" @click="onViewFloor(data)">查看位置</span>
        </div>
        <div class="seatCon">
          <span>柜号：{{ data?.name }}</span>
        </div>
        <div class="applyTime"><span>时间：</span>{{ data?.showTime }}</div>
        <div class="action">
          <div class="tips">
            <div class="clock" v-if="data?.use_time !== 0">
              <img src="@/assets/home/useTime.svg" alt="" />
              <span style="color: var(--primary-color)">
                {{ `${$t("Already_used")} ${data?.use_time} ${$t("Minutes")}` }}
              </span>
            </div>
            <!-- {{ `${$t("Please")} ${data.signintime} ${$t("Sign_in_before")}` }} -->
          </div>
          <div class="actionBtn">
            <!-- <button
            v-else-if="item?.status == '3'"
            class="btn cancel-appointment"
            style="background: #e58100"
            @click.stop="handleSignOut(item)"
          >
            {{ store?.state?.lang?.lang == "zh" ? "结束使用" : "End use" }}
          </button> -->

            <van-button
              v-if="data?.use_time == 0"
              class="btn cancel"
              plain
              type="primary"
              color="#F28800"
              @click.stop="onCancel(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "取消" }}
            </van-button>
          </div>
        </div>
      </div>
    </template>

    <van-overlay
      :show="state.showSpaceMap"
      @click="handleClick"
      teleport="#app"
      lock-scroll
    >
      <div
        class="wrapper captureArea"
        :class="{ mobileArea: systemMode == 'mobile' }"
        @click="handleClick"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
      >
        <SpaceSeatMap
          v-if="state.showSpaceMap"
          review
          :list="state.spaceList"
          :data="state.spaceInfo"
          :seatSelected="state.spaceSelected"
        />
      </div>
    </van-overlay>
  </div>
</template>
<style lang="less" scoped>
.AppointmentItem {
  padding: 12px 20px;
  .header {
    display: flex;
    margin-bottom: 14px;
    font-size: 15px;
    color: #202020;
    span {
      padding-left: 4px;
      flex: 1;
      text-align: left;
    }
    .seatType {
      padding: 3px 8px;
      background: rgba(26, 73, 192, 0.1);
      border-radius: 3px 3px 3px 3px;
      font-weight: normal;
      font-size: 13px;
      color: #1a49c0;
      &.spaceType {
        color: #4ec95b;
        background: rgba(78, 201, 91, 0.1);
      }
    }
  }
  .intro {
    padding: 14px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 6px 6px 6px 6px;
    font-size: 14px;
    color: #4a4a4a;
    > div {
      margin-bottom: 8px;
      text-align: left;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .introFirst {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .applyTime {
      display: flex;
      span {
        flex-shrink: 0;
      }
    }
    .areaView {
      white-space: nowrap;
      display: flex;
      font-size: 13px;
      color: #999999;
      img {
        margin-left: 5px;
      }
    }
    .action {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tips {
        font-size: 13px;
        font-weight: 400;
        color: #202020;
      }
      .clock {
        display: flex;
        align-items: center;
        img {
          margin-right: 6px;
        }
      }
      .actionBtn {
        white-space: nowrap;
        button {
          padding: 0 8px;
          min-width: 70px;
          height: 26px;
          line-height: 26px;
          border-radius: 13px;
          text-align: center;
          margin-left: 12px;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          text-transform: "capitalize";
        }

        // .cancel {
        //   background-color: transparent;
        //   color: #202020;
        // }
      }
    }
  }
  .seatCon {
    display: flex;
    align-items: center;
    .statusText {
      margin-left: 12px;
    }
    .viewPosition {
      margin-left: 12px;
      color: var(--primary-color);
      cursor: pointer;
    }
  }
}

.captureArea {
  height: 100vh;
  &.mobileArea {
    :deep(.spaceMap) {
      margin: 0 auto;
      width: 100% !important;
    }
  }
  :deep(.spaceMap) {
    margin: 0 auto;
    width: 80%;
    height: auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
