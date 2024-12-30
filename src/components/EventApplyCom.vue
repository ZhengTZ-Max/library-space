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
    <a-divider />
    <div class="dialog_item">
      <span>{{$t("user_phone")}}</span>
      <a-input
        class="dialog_input"
        v-model:value="state.inputInfo.phone"
        :placeholder="$t('Please_type_your_phone_number')"
      />
    </div>
    <div class="dialog_item mt-20">
      <span>邮箱地址</span>
      <a-input
        class="dialog_input"
        v-model:value="state.inputInfo.email"
        :placeholder="$t('Please_Enter_Email')"
      />
    </div>
    <a-divider />
    <a-button type="link" class="bottom_button"  @click="onApply"
      >{{$t("visitor_Confirm")}}</a-button
    >
  </div>
</template>
<style lang="less" scoped>
.dialog_item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  .dialog_input {
    flex: 1;
    margin-left: 20px;
  }
}
.mt-20 {
  margin-top: 20px;
}
.bottom_button{
    width: 100%;
    margin-top: -10px;
    margin-bottom: -10px;
}
</style>
