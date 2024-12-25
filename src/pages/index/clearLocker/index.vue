<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import ClearLocker from "@/components/clearLocker/index.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <ClearLocker />
</template>
<style lang="less" scoped></style>
