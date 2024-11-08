<script setup>
import { reactive, onMounted, watch, ref } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  inputInfo: {
    phone: "",
    email: "",
    isClose: false,
  },
});

onMounted(() => {
  state.inputInfo = props?.data || {};
});

const onApply = () => {
  state.inputInfo.isClose = true;
};
</script>
<template>
  <div>
    <div
      style="
        text-align: center;
        font-size: 16px;
        padding-top: 25px;
        padding-bottom: 20px;
      "
    >
      联系方式
    </div>

    <a-input
      class="dialog_input"
      v-model:value="state.inputInfo.phone"
      placeholder="联系电话"
    />
    <a-input
      class="dialog_input"
      v-model:value="state.inputInfo.email"
      placeholder="邮箱"
    />

    <!-- <a-button type="link" class="bottom_button" @click="onApply">确认</a-button> -->
    <div class="profile_footer">
      <button class="footer-button" @click="goToLink('/mo/...')">取消</button>
      <div class="divider"></div>
      <a-button type="link" color="primary" @click="onApply"
        >确认</a-button
      >
    </div>
  </div>
</template>
<style lang="less" scoped>
.dialog_input {
  width: 80%;
  border-radius: 20px;
  margin-left: 10%;
  margin-bottom: 25px;
}
.mt-20 {
  margin-top: 20px;
}
.profile_footer {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .footer-button {
    background: none;
    border: none;
    color: #999; /* 按钮文字颜色 */
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
  }

  .divider {
    width: 1px; /* 分隔线宽度 */
    height: 30px; /* 分隔线高度 */
    background-color: #e0e0e0; /* 分隔线颜色 */
  }
}
</style>
