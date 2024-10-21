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
  },
});

onMounted(() => {
  state.inputInfo = props?.data || {};
});
</script>
<template>
  <div>
    <a-divider />
    <div class="dialog_item">
      <span>联系电话</span>
      <a-input
        class="dialog_input"
        v-model:value="state.inputInfo.phone"
        placeholder="请输入联系电话"
      />
    </div>
    <div class="dialog_item mt-20">
      <span>邮箱地址</span>
      <a-input
        class="dialog_input"
        v-model:value="state.inputInfo.email"
        placeholder="请输入邮箱"
      />
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
