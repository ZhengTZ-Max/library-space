<template>
  <div class="pageVerify">
    <div class="loading">
      <div class="la-ball-atom la-dark la-2x">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="helpText">正在操作...</div>
    </div>
  </div>
</template>
<script setup>
import { nextTick, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

// import { touch_qr_books } from "@/httpAction/region";
// import { Toast, Dialog } from "vant";

const store = useStore();
const router = useRouter();
const route = useRoute();

const state = reactive({
  show: false,
  seatShow: false,
  confirmInfo: {},
  seatInfo: {},
  method: "",
});

onMounted(() => {
  //   store.dispatch("getCurrentTime");
  //   checkInfo();
});

// const checkInfo = () => {
//   // https://sh.swechat.cc/h5/#/scancheck?school=ske&type=1&t=48083715524

//   let qrInfo = route.query;
//   let qrType = route.query.type;
//   let qrTime = route.query.t;
//   let token = sessionStorage.getItem("token") || "";
//   let touchQRMethod = sessionStorage.getItem("touchQRMethod") || "";
//   let currentTime = store?.state?.config?.currentTime;
//   if (qrTime && currentTime) {
//     qrTime = (qrTime / 29 - 509) * 1000;
//     qrTime = qrTime + 60000;
//     qrTime = new Date(qrTime);
//     if (qrTime <= currentTime) {
//       Dialog.alert({
//         title: "提示",
//         message:
//           store?.state?.lang?.currentLang?.QR_code_expired ||
//           "二维码已失效，请到座位系统中预约",
//       }).then(() => {
//         toVerify();
//       });
//       return false;
//     }
//   }
//   if (touchQRMethod) {
//     qrType = touchQRMethod;
//   }
//   let type =
//     qrType == 1
//       ? "checkin"
//       : qrType == 2
//       ? "leave"
//       : qrType == 3
//       ? "checkout"
//       : "";
//   if (["delete", "checkin", "checkout", "leave"].includes(type)) {
//     if (token) {
//       state.method = type;
//       handleAction();
//     } else {
//       sessionStorage.setItem("touchQRMethod", qrInfo.type);
//       toVerify();
//     }
//   } else {
//     toVerify();
//   }
// };

// // 完全离开
// const handleAction = async (row) => {
//   try {
//     let params = {
//       method: state.method,
//     };
//     const res = await touch_qr_books(params);
//     Dialog.alert({
//       title: "提示",
//       message: res.msg,
//     }).then(() => {
//       toVerify();
//     });
//   } catch (e) {
//     console.log(e);
//     toVerify();
//   }
// };
const toVerify = () => {
  router.replace("pageVerify");
};
</script>
<style lang="less" scoped>
.pageVerify {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--van-primary-color);
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
</style>
