<script setup>
import _ from "lodash";
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";

import { getBanner, getGlobalConfig, getGlobalLang } from "@/request";

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

onMounted(() => {
  fetchBanner();
  fetchConfig();
  fetchLangConfig();
});

const fetchBanner = async () => {
  try {
    let res = await getBanner();
    store.dispatch("setBannerList", res?.data);
  } catch (e) {
    console.log(e);
  }
};

const fetchConfig = async () => {
  try {
    let res = await getGlobalConfig();
    store.dispatch("updateApiConfig", res?.data);
    console.log(store);
  } catch (e) {
    console.log(e);
  }
};

const fetchLangConfig = async () => {
  try {
    let res = await getGlobalLang();
    store.dispatch("updateLangData", res?.data);
    console.log(store);
  } catch (e) {
    console.log(e);
  }
};
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
