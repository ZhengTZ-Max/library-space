<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import ClearList from "@/components/clearLocker/clear.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <ClearList />
</template>
<style lang="less" scoped></style>
