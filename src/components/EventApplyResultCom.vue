<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
  show: {
    type: Boolean,
  },
});
const state = reactive({
  applyResultInfo: {
    result: "",
    message: "",
    isClose: false,
    eventInfo: {},
    eventTimeShow: "",
    eventDateIndex: "",
  },
});

onMounted(() => {
  state.applyResultInfo = props?.data || {};
  console.log(state.applyResultInfo);
});

const onApply = () => {
  state.applyResultInfo.isClose = true;
};
</script>
<template>
  <div>
    <div class="dialog_item">
      <div class="result_item">
        <img
          v-if="state.applyResultInfo.result === 'success'"
          src="@/assets/event/success.svg"
          alt="成功图像"
        />
        <img v-else src="@/assets/event/failed.svg" alt="失败图像" />
        <span>{{
          state.applyResultInfo.result === "success"
            ? $t("V4_registration_successful")
            : $t("V4_registration_failed")
        }}</span>
      </div>
      <div class="result_info_item">
        <span>{{ $t("user_activityname") }}:</span>
        <span>{{ state.applyResultInfo.eventInfo.title }}</span>
      </div>
      <div class="result_info_item">
        <span>{{ $t("user_activitytime") }}:</span>
        <span
          >{{ state.applyResultInfo.eventDateIndex }}
          {{ state.applyResultInfo.eventTimeShow }}</span
        >
      </div>
      <div class="result_info_item">
        <span>{{ $t("user_activityplace") }}:</span>
        <span>{{ state.applyResultInfo.eventInfo.nameMerge }}</span>
      </div>
      <div
        v-if="state.applyResultInfo.result === 'failed'"
        class="result_info_item"
      >
        <span>{{ $t("Reserved_Reserved") }}:</span>
        <span>{{ state.applyResultInfo.message }}</span>
      </div>
    </div>
    <a-divider />
    <a-button type="link" class="bottom_button" @click="onApply">
      {{ $t("visitor_Confirm") }}</a-button
    >
  </div>
</template>
<style lang="less" scoped>
.dialog_item {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  .result_item {
    display: flex;
    align-self: center;
    flex-direction: column;
    align-items: center;
  }
  span {
    margin-top: 5px;
    font-size: 14px;
    color: rgba(97, 97, 97, 1);
  }
}
.mt-20 {
  margin-top: 20px;
}
.ant-divider-horizontal {
  margin: 15px 0;
}
.bottom_button {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  margin-bottom: -20px !important;
  margin-top: -20px !important;
}
.result_info_item {
  display: flex;
  align-items: flex-start;
  margin-top: 15px;
  span {
    &:nth-child(1) {
      font-size: 16px;
      color: #a7a7a7;
      margin-left: 2px;
    }
    &:nth-child(2) {
      flex: 1;
      font-size: 16px;
      color: #6e6e6e;
      margin-left: 2px;
    }
  }
}
</style>
