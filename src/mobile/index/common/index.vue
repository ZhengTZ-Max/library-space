<route>
  {
    meta: {
      showHead: false,
      showLeftBack:false,
      title:'menu_home',
      showTabbar:true
    }
  }
  </route>
<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import CommonAppt from "@/components/moCommon/commonAppt.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <div class="common">
    <CommonAppt />
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
