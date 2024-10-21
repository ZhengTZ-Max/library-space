<script setup>
import { reactive, onMounted, watch, ref, computed } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  applyResultInfo: {
    result: "",
    message: "",
  },
});

onMounted(() => {
  state.applyResultInfo = props?.data || {};
});

</script>
<template>
  <div>

    <div class="dialog_item">
      <div class="result_item">
        <img v-if="state.applyResultInfo.result === 'success'" 
             src="@/assets/event/success.svg" 
             alt="成功图像" />
        <img v-else 
             src="@/assets/event/failed.svg" 
             alt="失败图像" />
        <span>报名成功</span>
      </div>
      <span>活动名称:XXX学院-青春校园影片展</span>
      <span>活动时间:2024-02-21 9:00-12:00</span>
      <span>活动地点:图书馆-3F-302研究室</span>
      <span>报名提醒:报名失败原因XXXXX</span>
    </div>
    <a-divider />
    <a-button type="link" class="bottom_button"  @click="onApply"
      >确认</a-button
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
.ant-divider-horizontal{
  margin: 15px 0;
}
.bottom_button{
    width: 100%;
    padding: 0 !important;
    margin: 0 !important;
    margin-bottom: -20px !important;
    margin-top: -20px !important;
}
</style>
