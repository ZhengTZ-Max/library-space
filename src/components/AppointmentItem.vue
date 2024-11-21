<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import {
  fetchCancelSeat,
  fetchSeatSignin,
  fetchSeatStudySign,
  fetchCancelStudyCancel,
} from "@/request/home";
import { showToast, showConfirmDialog } from "vant";
const store = useStore();
const lang = computed(() => store.state.lang);
const emit = defineEmits(["getList", "getSeatImgInfo"]);

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

const onCancel = (row) => {
  try {
    let res;
    let params = {
      id: row.id,
    };
    let message = `${row.areaName}:${row.no}`;
    if (row?.type == 2)
      message = `${row.areaName} ${lang == "zh" ? "的预约" : "Appointment"}？`;
    if (row?.type == 14)
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

const resetSubscribeList = () => {
  emit("getList");
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
          <div class="areaView">
            区域平面图
            <img src="@/assets/home/rightIcon.svg" alt="" />
          </div>
        </div>
        <div>座位：{{ data?.no }}</div>
        <div>时间：{{ data?.showTime }}</div>
        <div class="action">
          <div class="tips">
            {{ `${$t("Please")} ${data.signintime} ${$t("Sign_in_before")}` }}
            <!-- 时间：{{ data?.signintime }} -->
          </div>
          <div class="actionBtn">
            <van-button
              class="btn cancel"
              plain
              type="primary"
              color="#F28800"
              @click.stop="onCancel(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "取消" }}
            </van-button>
            <van-button
              class="btn sign"
              style="background-color: var(--primary-color)"
              @click.stop="handleSign(data)"
            >
              {{ store?.state?.lang?.currentLang?.signin || "签到" }}
            </van-button>
          </div>
        </div>
      </div>
    </template>
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
}
</style>
