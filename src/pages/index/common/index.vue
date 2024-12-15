<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import cAppointments from "@/pages/index/my/c-appointments.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <div class="about">
    <cAppointments />
  </div>
</template>
<style lang="less" scoped></style>
