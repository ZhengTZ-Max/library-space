<script setup>
import _ from "lodash";
import { computed } from "vue";
import { useStore } from "vuex";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";

const store = useStore();
const isPageLoading = computed(() => store.state.pageLoading);
const pageLoadingText = computed(() => store.state.pageLoadingText);
</script>
<template>
  <a-config-provider
    :locale="enUS"
    componentSize="large"
    :theme="{
      token: {
        colorPrimary: '#1a49c0',
      },
    }"
  >
    <a-spin :spinning="isPageLoading" size="large" :tip="pageLoadingText">
      <router-view />
    </a-spin>
  </a-config-provider>
</template>

<style lang="less"></style>
