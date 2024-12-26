<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";

import BoxList from "@/components/clearLocker/boxList.vue";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <BoxList />
</template>
<style lang="less" scoped></style>
