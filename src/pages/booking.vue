<template>
  <div class="pageVerify">
    <div class="loading">
      <div class="la-ball-atom la-dark la-2x">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="helpText">正在预约...</div>
    </div>
    <van-overlay :show="state.seatShow">
      <!-- <div class="seat" style="min-width: 260px">
        <div class="change_seat">
          <div class="title">
            {{
              store?.state?.lang?.currentLang?.Seat_change_tips ||
              "需要换的座位是"
            }}
          </div>
          <div class="desc">
            {{
              store?.state?.lang?.lang == "zh"
                ? state.checkSeatInfo.areainfo
                : state.checkSeatInfo.areainfoen
            }}
          </div>
        </div>
        <div class="seat_btn seat_check">
          <van-button
            @click="toVerify"
            block
            type="primary"
            class="btn btns cancel"
            >{{
              store?.state?.lang?.lang == "zh" ? "取消" : "Cancel"
            }}</van-button
          >
          <van-button
            v-if="
              store?.state?.config?.config?.config?.change_seat == 1 &&
              state.checkSeatInfo.status == 4
            "
            block
            type="primary"
            class="btn btns"
            @click="changeQrSeat"
            >{{
              store?.state?.lang?.currentLang?.Confirm_seat_change || "确认换座"
            }}</van-button
          >
        </div>
      </div> -->
    </van-overlay>
    <!-- <Overlay :show="state.statusThreeShow">
      <div class="seat" style="min-width: 260px">
        <div class="change_seat">
          <div class="title">
            {{
              store?.state?.lang?.currentLang?.Please_select_your_operation ||
              "请选择您需要的操作"
            }}
          </div>
          <div class="desc">
            {{
              store?.state?.lang?.lang == "zh"
                ? state.checkSeatInfo.areainfo
                : state.checkSeatInfo.areainfoen
            }}
          </div>
        </div>
        <div
          class="seat_btn seat_check"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <van-button
            v-if="state.checkSeatInfo.status == 6"
            block
            type="primary"
            class="btn btns"
            @click="handleAction('checkin')"
          >
            {{ store?.state?.lang?.currentLang?.signin || "签到" }}
          </van-button>
          <van-button
            v-else-if="state.checkSeatInfo.status == 7"
            block
            type="primary"
            class="btn btns"
            @click="handleAction('checkin')"
          >
            {{ store?.state?.lang?.currentLang?.return_signin || "返回签到" }}
          </van-button>
          <template v-else>
            <van-button
              v-if="
                state.checkSeatInfo.status == 3 &&
                state.qrActionInfo.flag_out == 1
              "
              style="margin-top: 12px"
              block
              type="primary"
              class="btn btns"
              @click="handleAction('leave')"
            >
              {{ store?.state?.lang?.currentLang?.rightback || "临时离开" }}
            </van-button>
            <van-button
              v-if="
                state.checkSeatInfo.status == 3 &&
                state.qrActionInfo.flag_out == 1
              "
              style="margin-top: 12px"
              block
              type="primary"
              class="btn btns"
              @click="handleAction('checkout')"
              >{{ store?.state?.lang?.currentLang?.leave || "完全离开" }}
            </van-button>
          </template>

          <van-button
            style="margin-top: 12px"
            @click="toVerify"
            block
            type="primary"
            class="btn btns cancel"
            >{{
              store?.state?.lang?.lang == "zh" ? "取消" : "Cancel"
            }}</van-button
          >
        </div>
      </div>
    </Overlay> -->
    <!-- <Overlay
      :show="state.show"
      :status="state.seatInfo.code != 1 ? 2 : 1"
      @cancel="state.show = false"
    >
      <div class="seat">
        <div class="seat_view">
          <div class="title">
            {{ store?.state?.lang?.lang == "zh" ? "预约地点" : "Address" }}：
          </div>
          <div>
            {{
              store?.state?.lang?.lang == "zh"
                ? state.checkSeatInfo.areainfo
                : state.checkSeatInfo.areainfoen
            }}
          </div>
        </div>
        <div class="seat_view">
          <div class="title">预约提醒：</div>
          <div>{{ state.seatInfo.msg }}</div>
        </div>
        <div class="seat_btn">
          <van-button @click="toVerify" type="primary" class="btn btns"
            >确认</van-button
          >
        </div>
      </div>
    </Overlay> -->
    <!-- <van-dialog
      v-model:show="state.changeSeatShow"
      :title="store?.state?.lang?.currentLang?.Appointment_Tips || '预约提示'"
      @confirm="toVerify"
    >
      <div class="seat_view1">
        <div class="title">
          {{ store?.state?.lang?.lang == "zh" ? "预约地点" : "Address" }}：
        </div>
        <div>
          {{
            store?.state?.lang?.lang == "zh"
              ? state.checkSeatInfo.areainfo
              : state.checkSeatInfo.areainfoen
          }}
        </div>
      </div>
      <div class="seat_view1">
        <div class="title">
          {{ store?.state?.lang?.lang == "zh" ? "预约提醒：" : "Reminders：" }}
        </div>
        <div>
          {{ state.changeSeatInfo.msg }}
        </div>
      </div>
    </van-dialog> -->
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import { checkSeatAsk } from "@/request/seat";

import { Toast, Dialog } from "vant";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  qrInfo: {},

  show: false,
  seatShow: true,
  confirmInfo: {},
  seatInfo: {},
  checkSeatInfo: {},
  changeSeatShow: false,
  changeSeatInfo: {},
  statusThreeShow: false,
  qrActionInfo: {},
  StorageQrJson: {},
});

onMounted(() => {
  console.log("首先校验参数");
  checkInfo();
});

const checkInfo = () => {
  // https://sh.swechat.cc/h5/#/booking?area_id=50&seat_id=3729

  let qrInfo = route.query;
  let StorageQr = sessionStorage.getItem("StorageQr") || "";
  let token = sessionStorage.getItem("token") || "";
  console.log(route);

  if (!token && qrInfo?.area_id) {
    sessionStorage.setItem("StorageQr", route?.fullPath);
    toVerify();
  } else if (token) {
    state.qrInfo = qrInfo;
    StorageQr && sessionStorage.removeItem("StorageQr");
    checkSeat();
  }
  // if (!token && qrInfo?.area_id) {
  //   sessionStorage.setItem("StorageQr", JSON.stringify(qrInfo));
  //   toVerify();
  // } else if (token) {
  //   if (StorageQr) {
  //     state.qrInfo = JSON.parse(StorageQr);
  //   } else if (qrInfo?.area_id) {
  //     state.qrInfo = qrInfo;
  //   } else {
  //     toVerify();
  //   }
  // }
  // let currentTime = store?.state?.config?.currentTime;

  // let StorageQrJson = (StorageQr && JSON.parse(StorageQr)) || false;
  // state.StorageQrJson = StorageQrJson;
  // let qrTime = route?.query?.t || StorageQrJson?.t || "";
  // let qrM = route?.query?.m || StorageQrJson?.m || "";

  // state.qrActionInfo = {
  //   qrTime,
  //   qrM,
  // };
  // if (qrTime && qrM && currentTime) {
  //   qrTime = (qrTime / 29 - 509) * 1000;
  //   qrTime = qrTime + qrM * 60 * 1000;
  //   console.log(qrTime);
  //   qrTime = new Date(qrTime);
  //   if (qrTime <= currentTime) {
  //     Dialog.alert({
  //       title: "提示",
  //       message:
  //         store?.state?.lang?.currentLang?.QR_code_expired ||
  //         "二维码已失效，请到座位系统中预约",
  //     }).then(() => {
  //       toVerify();
  //     });
  //     return false;
  //   }
  // }

  // if (qrInfo.area_id && qrInfo.seat_id) {
  //   if (token) {
  //     checkSeat(qrInfo);
  //     // submitInfo(qrInfo);
  //   } else {
  //     sessionStorage.setItem("qrInfo", JSON.stringify(qrInfo));
  //     toVerify();
  //   }
  // } else if (StorageQr) {
  //   if (token) {
  //     checkSeat(JSON.parse(StorageQr));

  //     // submitInfo(JSON.parse(StorageQr));
  //   } else {
  //     toVerify();
  //   }
  // } else {
  //   toVerify();
  // }
};

const changeQrSeat = () => {
  let qrInfo = route.query;
  let StorageQr = sessionStorage.getItem("qrInfo") || "";
  if (qrInfo.area_id && qrInfo.seat_id) {
    changeSeat(qrInfo);
  } else if (StorageQr) {
    changeSeat(JSON.parse(StorageQr));
  }
};

const changeSeat = async (data) => {
  try {
    console.log(data);
    let params = {
      seat_id: data.seat_id,
    };
    let res;
    if (state.qrActionInfo.qrTime && state.qrActionInfo.qrM) {
      res = await changeSeatAskV2(params);
    } else {
      res = await changeSeatAsk(params);
    }
    state.changeSeatInfo = res;
    state.changeSeatShow = true;
    state.seatShow = false;
  } catch (e) {
    console.log(e);
  }
};

const checkSeat = async () => {
  try {
    let params = {
      seat_id: state.qrInfo.seat_id,
    };
    const res = await checkSeatAsk(params);
    state.checkSeatInfo = res;

    // if (
    //   store?.state?.config?.config?.config?.change_seat != 1 &&
    //   state.checkSeatInfo.status == 4
    // ) {
    //   toVerify();
    //   return;
    // }

    if ([3, 6, 7].includes(Number(state.checkSeatInfo.status))) {
      // subscribeList();
      return;
    } else if ([0, 2, 5].includes(Number(res.status))) {
      // toVerify();
      return false;
    } else if ([1, 8].includes(Number(res.status))) {
      // submitInfo(data);
      return false;
    }

    // if (state.qrActionInfo.qrTime && state.qrActionInfo.qrM) {
    //   if (state.checkSeatInfo.status == 3) {
    //     subscribeList();
    //     return;
    //   } else if (
    //     state.checkSeatInfo.status == 6 ||
    //     state.checkSeatInfo.status == 7
    //   ) {
    //     subscribeList();
    //     return;
    //   } else {
    //     if ([0, 2, 3, 5, 6, 7].includes(Number(res.status))) {
    //       toVerify();
    //       return false;
    //     } else if ([1, 8].includes(Number(res.status))) {
    //       submitInfo(data);
    //       return false;
    //     }
    //   }
    // } else {
    //   if ([0, 2, 3, 5, 6, 7].includes(Number(res.status))) {
    //     toVerify();
    //     return false;
    //   } else if ([1, 8].includes(Number(res.status))) {
    //     submitInfo(data);
    //     return false;
    //   }
    // }

    state.seatShow = true;
  } catch (e) {
    console.log(e);
  }
};

const submitInfo = async (data) => {
  try {
    let res;
    if (state.qrActionInfo.qrTime && state.qrActionInfo.qrM) {
      res = await updateSeatAskV2(data);
    } else {
      res = await updateSeatAsk(data);
    }

    state.seatInfo = res;
    state.show = true;
  } catch (e) {
    console.log("失败");
  }
};
const toVerify = () => {
  router.replace("/");
};

// 完全离开
const handleAction = async (type) => {
  try {
    let qrTime = route?.query?.t || state.StorageQrJson?.t;
    if (!qrTime) {
      let qrInfo = state.qrActionInfo;
      if (type == "checkin") {
        handleSign(qrInfo.id);
      } else if (type == "checkout") {
        handleCheckout(qrInfo.id);
      } else if (type == "leave") {
        handleLeave(qrInfo.id);
      }
      console.log("action -- ", type, qrInfo);
      return false;
    }

    let params = {
      method: type,
    };
    const res = await touch_qr_books(params);
    Dialog.alert({
      title: "提示",
      message: res.msg,
    }).then(() => {
      // toVerify();

      location.replace(location.origin);
      sessionStorage.removeItem("qrInfo");
    });
  } catch (e) {
    console.log(e);
    toVerify();
  }
};

// 预约列表
const subscribeList = async (type = 1) => {
  try {
    let params = {
      type, //todo-暂时传1
    };
    const res = await subscribe(params);
    if (res.code != 1) {
      return false;
    }

    // state.subscribeList = [...state.subscribeList, ...res.data];
    state.qrActionInfo = {
      ...state.qrActionInfo,
      ...res.data[0],
    };
    state.statusThreeShow = true;
  } catch (e) {
    console.log(e);
  }
};

const handleCheckout = async (id) => {
  try {
    const res = await SpaceCheckout({ id });
    Dialog.alert({
      title: "提示",
      message: res.msg,
    }).then(() => {
      // toVerify();
      location.replace(location.origin);
    });
  } catch (e) {
    console.log(e);
  }
};
const handleLeave = async (id) => {
  try {
    const res = await SpaceLeave({ id });
    Dialog.alert({
      title: "提示",
      message: res.msg,
    }).then(() => {
      // toVerify();
      location.replace(location.origin);
    });
  } catch (e) {
    console.log(e);
  }
};
const handleSign = async (id) => {
  try {
    const res = await SpaceSign({ id });
    Dialog.alert({
      title: "提示",
      message: res.msg,
    }).then(() => {
      // toVerify();
      location.replace(location.origin);
    });
  } catch (e) {
    console.log(e);
  }
};
</script>
<style lang="less">
.pageVerify {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #2980b9;
}
.helpText {
  margin-top: 45px;
  position: relative;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}
.loading {
  margin: 20px auto;
  position: relative;
  top: -10%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.seat {
  margin-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 99;
  .seat_view {
    display: flex;
    align-items: baseline;
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    margin-bottom: 10px;
    .title {
      width: 100px;
      flex-shrink: 0;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #212121;
    }
  }
  .seat_btn {
    margin-top: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    .btns {
      width: 240px;
      height: 44px;
      border-radius: 25px;
      font-size: 17px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 44px;
    }
  }
  .seat_check {
    margin-top: 32px;
    display: flex;

    button {
      margin: 0 12px;
      &.cancel {
        background-color: transparent;
        color: var(--van-primary-color);
        border: 1px solid var(--van-primary-color);
      }
    }
  }
  .change_seat {
    .title {
      font-weight: 600;
      text-align: center;
    }
    .desc {
      margin-top: 16px;
      text-align: center;
    }
  }
}
.seat_view1 {
  margin-top: 14px;
  padding: 0 32px;
  display: flex;
  align-items: baseline;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  margin-bottom: 10px;
  .title {
    width: 80px;
    flex-shrink: 0;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #212121;
  }
}
</style>
