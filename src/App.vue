<script setup>
import _ from "lodash";
import { computed, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { tabType } from "@/utils";

import {
  getBanner,
  getGlobalConfig,
  getGlobalLang,
  getNotice,
} from "@/request";
import { getCategory } from "@/request/home";

const store = useStore();
const route = useRoute();
const router = useRouter();
const isPageLoading = computed(() => store.state.pageLoading);
const pageLoadingText = computed(() => store.state.pageLoadingText);
const hasClass = (className) => {
  return document.body.classList.contains(className);
};
const addClassToBody = (className) => {
  document.body.classList.add(className);
};

watch(
  () => store.state.systemMode,
  (mode) => {
    // 使用
    if (!hasClass("mobile") && mode == "mobile") {
      addClassToBody(mode);
    }
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
  fetchNotice();
  fetchCategory();
});

const fetchCategory = async () => {
  try {
    // state.isCodeLoading = true;
    const res = await getCategory();
    // state.isCodeLoading = false;

    if (res.code != 0) {
      return false;
    }
    let categoryList = res.data || [];
    categoryList = res.data || [];
    categoryList = categoryList?.map((e) => {
      return {
        ...e,
        path: tabType?.find((t) => t?.id == e?.id)?.path,
      };
    });
    store.dispatch("setCategoryList", categoryList || []);

    // state.categoryList = categoryList;
  } catch (e) {
    console.log(e);
  }
};
const fetchNotice = async () => {
  try {
    let res = await getNotice();
    store.dispatch("setNoticeList", res?.data?.data || []);
  } catch (e) {
    console.log(e);
  }
};

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
    :locale="zhCN"
    componentSize="large"
    :theme="{
      token: {
        colorPrimary: '#1a49c0',
      },
    }"
  >
    <router-view />
  </a-config-provider>
</template>

<style lang="less"></style>
