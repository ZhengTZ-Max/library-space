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

    <ShowInfoToast
      v-if="state.apptResult.show"
      v-model:isShow="state.apptResult.show"
      :type="state.apptResult.type"
      :title="state.apptResult.title"
      :okText="state.apptResult.okText"
      :hideIcon="state.apptResult.hideIcon"
      @handleShow="handleShow"
    >
      <template v-slot:content>
        <div
          v-if="[1, 8]?.includes(state.apptResult?.seatInfo?.status)"
          class="toastItem"
        >
          <span>{{ $t("Time") }}：</span>
          <span>{{ state.apptResult?.seatInfo?.show_time }}</span>
        </div>
        <div class="toastItem">
          <span>{{ $t("Place") }}：</span>
          <span>{{ state.apptResult?.seatInfo?.show_area }}</span>
        </div>
        <div
          v-if="[1, 8]?.includes(state.apptResult?.seatInfo?.status)"
          class="toastItem"
        >
          <span>{{ $t("V4_seats") }}：</span>
          <span>{{ state.apptResult?.seatInfo?.show_seat }}</span>
        </div>
        <div v-if="state.apptResult?.msg" class="toastItem">
          <span>{{ $t("V4_reminder") }}：</span>
          <span>{{ state.apptResult?.msg }}</span>
        </div>
        <div v-if="state.apptResult?.seatInfo?.status == 4" class="changeSeat">
          <van-button class="btn cancel" @click="toVerify">
            {{ $t("cancel") }}
          </van-button>
          <van-button
            class="btn sign"
            type="primary"
            @click="handleAction('changeSeat')"
          >
            {{ $t("Confirm_seat_change") }}
          </van-button>
        </div>

        <div v-if="state.apptResult?.seatInfo?.status == 3" class="seatAction">
          <van-button
            block
            class="btn sign"
            round
            type="primary"
            @click="handleAction('sign')"
          >
            {{ $t("return_signin") }}
          </van-button>
          <van-button
            block
            class="btn leave"
            round
            type="primary"
            @click="handleAction('leave')"
          >
            {{ $t("rightback") }}
          </van-button>
          <van-button
            block
            class="btn checkout"
            round
            color="#e58100"
            @click="handleAction('checkout')"
          >
            {{ $t("leave") }}
          </van-button>
          <van-button block class="btn cancel" round>
            {{ $t("cancel") }}
          </van-button>
        </div>
      </template>
    </ShowInfoToast>
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { showToast, showDialog } from "vant";

import { checkSeatAsk, SeatQrChange } from "@/request/seat";
import {
  fetchSeatSignin,
  fetchSeatleave,
  fetchSeatCheckout,
} from "@/request/home";

import ShowInfoToast from "@/components/ShowInfoToast.vue";
import { exchangeDateTime } from "@/utils";

const store = useStore();
const router = useRouter();
const route = useRoute();
const systemMode = computed(() => store.state.systemMode);

const state = reactive({
  qrInfo: {},
  apptResult: {},
});

onMounted(() => {
  console.log("首先校验参数");
  checkInfo();
});

const checkInfo = async () => {
  // https://sh.swechat.cc/h5/#/booking?area_id=50&seat_id=3729

  let qrInfo = route.query;
  let StorageQr = sessionStorage.getItem("StorageQr") || "";
  let token = sessionStorage.getItem("token") || "";
  // console.log(route);
  // let time = await verifyTime();
  // console.log(time);

  // let qrTime = state.qrInfo?.t;
  // let qrType = state.qrInfo?.type;
  // if (qrTime) {
  //   // 定义过期时间
  //   qrTime = Number(qrTime) + 60000;
  //   if (new Date(decryptTime(qrTime)) <= currentTime) {
  //     showDialog({
  //       title: "提示",
  //       message: "二维码已失效，请到座位系统中预约.",
  //     }).then(() => {
  //       toVerify();
  //     });
  //     return false;
  //   }
  // }

  if (!token && qrInfo?.area_id) {
    sessionStorage.setItem("StorageQr", route?.fullPath);
    toVerify();
  } else if (token) {
    state.qrInfo = qrInfo;
    StorageQr && sessionStorage.removeItem("StorageQr");
    checkSeat();
  } else {
    toVerify();
  }
};

const checkSeat = async () => {
  try {
    let params = {
      ...state.qrInfo,
    };
    console.log(params)
    const res = await checkSeatAsk(params);

    let resultShow = {
      seatInfo: res?.data,
      show: true,
      // title: res?.code == 0 ? "预约成功" : "预约失败",
      // type: res?.code == 0 ? "success" : "error",
      // msg: (res?.code != 0 && res?.message) || "",
    };
    let status = res?.data?.status;
    if ([1].includes(Number(status))) {
      resultShow = {
        ...resultShow,
        type: "success",
        title: $t("yuyue_success"),
      };
    } else if ([3].includes(Number(status))) {
      resultShow = {
        ...resultShow,
        title: "请选择您需要的操作",
        hideIcon: true,
        okText: "none",
      };
    } else if ([4].includes(Number(status))) {
      resultShow = {
        ...resultShow,
        title: $t("Seat_change_tips"),
        hideIcon: true,
        okText: "none",
      };
    } else if ([0, 2, 5, 6, 7].includes(Number(status))) {
      toVerify();
    } else if ([8].includes(Number(status))) {
      resultShow = {
        ...resultShow,
        title: "换座失败",
        type: "error",
        msg: res?.msg,
      };
    } else if ([9].includes(Number(res.status))) {
      let path = `/seat/appointment?id=${
        state.qrInfo.seat_id
      }&date=${exchangeDateTime(new Date(), 2)}`;

      if (systemMode?.value == "mobile") {
        path = "/mo" + path;
      }
      router.replace(path);
    }
    state.apptResult = resultShow;
    console.log(state.apptResult, "state.apptResult");
  } catch (e) {
    console.log(e);
  }
};

const handleAction = async (type) => {
  try {
    let res;
    if (type == "sign") {
      res = await fetchSeatSignin({ id: state.qrInfo.seat_id });
    } else if (type == "leave") {
      res = await fetchSeatleave({ id: state.qrInfo.seat_id });
    } else if (type == "checkout") {
      res = await fetchSeatCheckout({ id: state.qrInfo.seat_id });
    } else if (type == "changeSeat") {
      res = await SeatQrChange({ id: state.qrInfo.seat_id });
    }

    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res.message,
        forbidClick: true,
      });
      return false;
    }
    showToast({
      message: res.message,
      duration: 1500,
      forbidClick: true,
    });
    setTimeout(() => {
      toVerify();
    }, 1500);
  } catch (e) {
    console.log(e);
  }
};

const handleShow = (v) => {
  if (!v && state.apptResult?.type == "success") {
    if (systemMode?.value == "pc") {
      router.replace("/");
    } else {
      router.replace("/mo/current");
    }
  }
};

const toVerify = () => {
  router.replace("/");
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
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
}
.showInfoCon {
  width: 260px;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .showIcon {
    width: 50px;
    height: 50px;
  }
  .infoText {
    margin-top: 10px;
    margin-bottom: 30px;
    font-size: 16px;
    color: #202020;
  }

  .changeSeat {
    margin-top: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    button {
      min-width: 100px;
    }
    .cancel {
      background-color: transparent;
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }
  }
  .seatAction {
    width: 100%;
    button {
      margin-top: 12px;
    }
  }
}
</style>
