<script setup>
import { reactive, onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import _ from "lodash";

const store = useStore();
const pageResizing = computed(() => store.state.pageResizing);

const state = reactive({});

onMounted(() => {});

watch(
  () => pageResizing,
  _.debounce((v) => {
    state.isShowTable = false;
    setTimeout(() => {
      state.isShowTable = true;
    }, 1);
  }, 500),
  {
    immediate: true,
    deep: true,
  }
);
</script>
<template>
  <div class="PageSizeCom">
    <slot v-if="state.isShowTable"></slot>
  </div>
</template>
<style lang="less" scoped>
.PageSizeCom {
  width: 100%;
  height: 100%;
}
</style>
