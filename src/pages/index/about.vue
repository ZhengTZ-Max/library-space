<script setup>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();

const state = reactive({});

onMounted(() => {});
</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<style lang="less" scoped></style>
