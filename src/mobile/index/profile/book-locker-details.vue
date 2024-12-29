<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { getUserInfo } from "@/utils";
const store = useStore();
const router = useRouter();
const route = useRoute();

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
</script>
<template>
  <div class="book-locker-details">
    <van-cell-group class="top_info">
      <van-cell
        class="info_item_status"
        :class="{
          info_item_status_success: state.propsData.statusMsg === '预约成功',
          info_item_status_in_progress: state.propsData.statusMsg === '使用中',
          info_item_status_error:
            state.propsData.statusMsg === '未签到' ||
            state.propsData.statusMsg === '使用超时',
        }"
        :title="$t('Status')"
        :value="state.propsData.statusMsg"
      />
      <van-cell
        class="info_item"
        :title="$t('yuyue_username')"
        :value="state.UserInfo.name + ' (' + state.UserInfo.id + ')'"
      />
      <van-cell
        class="info_item"
        :title="$t('yuyue_time')"
        :value="state.propsData.beginTime"
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
    </van-cell-group>
    <van-cell-group class="bottom_info">
      <!-- 使用中  存物时间 -->
      <template v-if="state.propsData.statusMsg === '使用中'">
        <van-cell
          class="info_item"
          title="存物时间"
          :value="state.propsData.beginTime"
        />
      </template>

      <!-- 已取消  取消时间 -->
      <template v-else-if="state.propsData.statusMsg === '已取消'">
        <van-cell
          class="info_item"
          :title="$t('Cancel_time')"
          :value="state.propsData.beginTime"
        />
      </template>

      <!-- 已结束  存物时间/结束时间 -->
      <template v-else-if="state.propsData.statusMsg === '已结束'">
        <van-cell
          class="info_item"
          title="存物时间"
          :value="state.propsData.beginTime"
        />
        <van-cell
          class="info_item"
          :title="$t('user_endtime')"
          :value="state.propsData.finishTime"
        />
      </template>

      <!-- 未签到 违约时间 -->
      <template v-else-if="state.propsData.statusMsg === '未签到'">
        <van-cell
          class="info_item"
          :title="$t('user_renegetime')"
          :value="state.propsData.beginTime"
        />
      </template>

      <!-- 使用超时 使用超时时间 -->
      <template v-else-if="state.propsData.statusMsg === '使用超时'">
        <van-cell
          class="info_item"
          title="存物时间"
          :value="state.propsData.beginTime"
        />
        <van-cell
          class="info_item"
          title="取物时间"
          :value="state.propsData.beginTime"
        />
        <van-cell
          class="info_item_red"
          :title="$t('V4_timeout_duration')"
          :value="state.propsData.beginTime + $t('Minutes')"
        />
      </template>
    </van-cell-group>
    <div
      class="bottom_info_btn"
      v-if="state.propsData.statusMsg === '预约成功'"
    >
      <a-button shape="round" block class="cancel_btn">
        {{ $t("visitor_Cancel_Reservation") }}
      </a-button>
    </div>
  </div>
</template>
<style lang="less" scoped>
.book-locker-details {
  position: relative;
  height: 100%;
  overflow: auto;
  background-color: #fafafa;
  .top_info {
    margin-top: 16px;
    background-color: #fff;
    .info_item_status {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
    .info_item_status_success {
      --van-cell-value-color: rgba(78, 201, 91, 1);
    }
    .info_item_status_in_progress {
      --van-cell-value-color: rgba(31, 86, 225, 1);
    }
    .info_item_status_error {
      --van-cell-value-color: rgba(223, 31, 31, 1);
    }
    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
  }
  .bottom_info {
    margin-top: 16px;

    .info_item {
      --van-cell-value-color: rgba(32, 32, 32, 1);
    }
    .info_item_red {
      --van-cell-value-color: rgba(255, 0, 0, 1);
    }
  }
  .bottom_info_btn {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    padding: 16px;
    .cancel_btn {
      border-color: rgba(26, 73, 192, 0.5);
      color: rgba(26, 73, 192, 1);
      font-size: 15px;
    }
  }
}
:deep(.van-cell__title) {
  color: rgba(97, 97, 97, 1) !important;
  font-size: 14px;
}
</style>
