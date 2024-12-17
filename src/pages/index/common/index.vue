<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import cAppointments from "@/pages/index/my/c-appointments.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <div class="common">
    <cAppointments />
  </div>
</template>
<style lang="less" scoped>
.common {
  height: 100%;
  // :deep(.ant-spin-container) {
  //   position: relative;
  // }
  // :deep(.ant-pagination) {
  //   position: absolute;
  //   right: 0;
  //   bottom: 0;
  // }
}
</style>
