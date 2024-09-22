<script setup>
import _ from "lodash";
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";

const store = useStore();
const route = useRoute();
const router = useRouter();
const isPageLoading = computed(() => store.state.pageLoading);
const pageLoadingText = computed(() => store.state.pageLoadingText);

watch(
  () => store.state.systemMode,
  (mode) => {
    if (mode == "pc" && route.path?.includes("/mo")) {
      router.replace("/");
    } else if (mode != "pc" && !route.path?.includes("/mo")) {
      router.replace("/mo");
    }
    console.log("mode", mode, route);
  }
);
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
