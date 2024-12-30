<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { getUserInfo } from "@/utils";

const props = defineProps({
  data: {
    type: Object,
  },
});
const state = reactive({
  userInfo: getUserInfo(),
  inputInfo: {
    phone: "",
    email: "",
    isClose: false,
  },
});

onMounted(() => {
  state.inputInfo = props?.data || {};
  if (!state.inputInfo?.phone) {
    state.inputInfo.phone = state.userInfo?.mobile || "";
  }
  if (!state.inputInfo?.email) {
    state.inputInfo.email = state.userInfo?.email || "";
  }
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
      {{ $t("V4_contact_information") }}
    </div>

    <a-input
      class="dialog_input"
      v-model:value="state.inputInfo.phone"
      :placeholder="$t('user_phone')"
    />
    <a-input
      class="dialog_input"
      v-model:value="state.inputInfo.email"
      :placeholder="$t('user_email')"
    />

    <!-- <a-button type="link" class="bottom_button" @click="onApply">确认</a-button> -->
    <div class="profile_footer">
      <button class="footer-button" @click="goToLink('/mo/...')">{{$t("cancel")}}</button>
      <div class="divider"></div>
      <a-button type="link" color="primary" @click="onApply"
        >{{$t("visitor_Confirm")}}</a-button
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
