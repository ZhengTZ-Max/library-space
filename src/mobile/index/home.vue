<script setup>
import Tabs from "@/components/h-tabs.vue";
import { reactive } from "vue";
</script>

<template>
  <div class="home">
    首页
    <div class="tabsCon"><Tabs></Tabs></div>
  </div>
</template>
<style scoped lang="less">
.home {
  .tabsCon {
    padding: 0 14px;
  }
}
</style>
