<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getUserInfo } from "@/utils";
import { showToast, showConfirmDialog } from "vant";
import { fetchCancelSeat, fetchCancelStudyCancel } from "@/request/home";

const store = useStore();
const router = useRouter();
const route = useRoute();
const lang = computed(() => store.state.lang);
const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  UserInfo: getUserInfo(),
  propsData: {},
});

onMounted(() => {
  state.propsData = props?.data || {};
});

const onCancel = async () => {
  try {
    let res;
    let params = {
      id: state.propsData.id,
    };
    let message = "";
    if (state.propsData.activeKey == "1") {
      message = `${state.propsData.nameMerge}:${state.propsData.name} ${
        lang == "zh" ? "的预约" : "Appointment"
      }？`;
    } else {
      message = `${state.propsData.nameMerge}:${state.propsData.spacename} ${
        lang == "zh" ? "的预约" : "Appointment"
      }？`;
    }
    showConfirmDialog({
      title: $t("cancelappointment"),
      message,
    }).then(async () => {
      if (state.propsData.activeKey == "1") {
        res = await fetchCancelSeat(params);
      } else {
        res = await fetchCancelStudyCancel(params);
      }
      if (res.code == 0) {
        showToast({
          message: res?.message || res?.msg,
        });
        router.back();
      }
    });
  } catch (e) {
    console.log(e);
  }
};
</script>
<template>
  <div class="area-record-details">
    <div
      class="top_info"
      :class="{
        height_calc:
          (state.propsData.activeKey == '1' &&
            (state.propsData.status === '2' ||
              state.propsData.status === '9')) ||
          (state.propsData.activeKey != '2' && state.propsData.status === '1'),
      }"
    >
      <!-- 普通座位
                  预约成功			2、9
                  预约待审核		1、32	
                  待邀			    21
                  草稿			    31
                  使用中			  3、11、33
                  已结束			  4、8、12、34、35
                  已取消			  6
                  状态异常			其它
                -->
      <van-cell-group>
        <van-cell
          v-if="state.propsData.activeKey == '1'"
          class="info_item_status"
          :class="{
            info_item_status_success:
              state.propsData.status === '2' || state.propsData.status === '9',
            info_item_status_blue:
              state.propsData.status === '3' ||
              state.propsData.status === '11' ||
              state.propsData.status === '33',
          }"
          :title="$t('Status')"
          :value="state.propsData.status_name"
        />

        <!-- 考研/研习座位
                  已预约    1   绿色 可取消
                  已取消    2   灰色
                  暂停      3   橙色
                  已结束    4   灰色
                  状态异常  其它 灰色
                -->
        <van-cell
          v-else
          class="info_item_status"
          :class="{
            info_item_status_success: state.propsData.status === '1',
            info_item_status_gray:
              state.propsData.status === '2' ||
              state.propsData.status === '4' ||
              state.propsData.status_name === '状态异常',
            info_item_status_orange: state.propsData.status === '3',
          }"
          :title="$t('Status')"
          :value="state.propsData.status_name"
        />

        <van-cell
          class="info_item"
          :title="$t('yuyue_username')"
          :value="state.UserInfo.name + ' (' + state.UserInfo.id + ')'"
        />
        <van-cell
          class="info_item"
          :title="$t('yuyue_time')"
          :value="state.propsData.examTime"
        />
        <van-cell
          class="info_item"
          :title="$t('user_begintime')"
          :value="state.propsData.beginTime"
        />
        <van-cell
          class="info_item"
          :title="$t('user_endtime')"
          :value="state.propsData.endTime"
        />
        <van-cell
          class="info_item"
          :title="$t('Reservation_location')"
          :value="state.propsData.nameMerge"
        />
        <van-cell
          class="info_item"
          title="座位号"
          :value="
            state.propsData.activeKey == '1'
              ? state.propsData.name
              : state.propsData.spacename
          "
        />
      </van-cell-group>

      <br />
      <!-- 取消时间  签到时间-->

      <template v-for="item in state.propsData.timelist">
        <van-cell
          class="info_item"
          :title="item.status_name"
          :value="item.operateTime"
        />
      </template>
    </div>

    <!-- 普通座位 2/9 显示取消预约 -->
    <!-- 考研/研习座位 1 显示取消预约 -->
    <div
      class="bottom_info_btn"
      v-if="
        (state.propsData.activeKey == '1' &&
          (state.propsData.status === '2' || state.propsData.status === '9')) ||
        (state.propsData.activeKey != '2' && state.propsData.status === '1')
      "
    >
      <a-button shape="round" block class="cancel_btn" @click="onCancel"
        >{{ $t("cancelappointment") }}</a-button
      >
    </div>
  </div>
</template>
<style lang="less" scoped>
.area-record-details {
  position: relative;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .height_calc {
    height: calc(100% - 50px);
  }
  .top_info {
    overflow-y: auto;

    .info_item_status {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
    .info_item_status_success {
      --van-cell-value-color: rgba(78, 201, 91, 1);
    }
    .info_item_status_blue {
      --van-cell-value-color: rgba(31, 86, 225, 1);
    }
    .info_item_status_gray {
      --van-cell-value-color: rgba(153, 153, 153, 1);
    }
    .info_item_status_orange {
      --van-cell-value-color: rgba(255, 153, 0, 1);
    }
    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }

    .all_member {
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      overflow: hidden;
      color: #616161;
      font-size: 14px;
      background-color: #fff;
      .right_value {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-end;
      }
    }
    .sign_time {
      padding: 10px 16px;
      background-color: #fff;
      margin-top: 10px;
      .sign_time_value {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        overflow: hidden;
        color: #616161;
        font-size: 14px;
      }
    }
  }
  .bottom_info {
    margin-top: 16px;

    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
  }
  .bottom_info_btn {
    flex: 1;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
  .bottomAct {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    & button {
      &:nth-child(1) {
        margin-right: 12px;
      }
    }
  }
}
:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
:deep(.van-cell__value) {
  flex: 2.2 !important;
}
</style>
