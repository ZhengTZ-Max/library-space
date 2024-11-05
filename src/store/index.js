// src/store/index.js
import { createStore } from "vuex";
import { getBanner } from "../request";

const store = createStore({
  state: {
    pageLoading: false,
    pageLoadingText: "",
    systemMode: "",
    bannerList: [],
    noticeList: [],
    categoryList: [],

    apiConfig: {},
    loginInfo: {},
    langData: {},
    lang: "en",

    userName: "",
  },
  mutations: {
    setCategoryList(state, list) {
      state.categoryList = list;
    },
    setNoticeList(state, list) {
      state.noticeList = list;
    },
    systemMode(state, mode) {
      state.systemMode = mode;
    },
    setPageLoading(state, isLoading) {
      state.pageLoading = isLoading;
    },
    setPageLoadingText(state, text) {
      state.pageLoadingText = text;
    },
    setBannerList(state, list) {
      state.bannerList = list;
    },
    setLoginInfo(state, info) {
      state.loginInfo = info;
    },
    setApiConfig(state, info) {
      state.apiConfig = info;
    },
    setLangData(state, data) {
      state.langData = data;
    },
    setLang(state, data) {
      state.lang = data;
    },
    setUserName(state, name) {
      state.userName = name;
    },
  },
  actions: {
    setCategoryList({ commit }, list) {
      commit("setCategoryList", list);
    },
    setNoticeList({ commit }, list) {
      commit("setNoticeList", list);
    },
    setPageLoading({ commit }, isLoading) {
      commit("setPageLoading", isLoading);
    },
    setPageLoadingText({ commit }, text) {
      commit("setPageLoadingText", text);
    },
    updateSystemMode({ commit }, mode) {
      commit("systemMode", mode);
    },
    setBannerList({ commit }, list) {
      commit("setBannerList", list);
    },
    updateLoginInfo({ commit }, info) {
      commit("setLoginInfo", info);
    },
    updateApiConfig({ commit }, info) {
      commit("setApiConfig", info);
    },
    updateLangData({ commit }, data) {
      commit("setLangData", data);
    },
    updateLang({ commit }, type) {
      commit("setLang", type);
    },
    setUserName({ commit }, name) {
      commit("setUserName", name);
    },
  },
  getters: {
    isPageLoading(state) {
      return state.pageLoading;
    },
    getPageLoadingText(state) {
      return state.pageLoadingText;
    },
    systemMode(state) {
      return state.systemMode;
    },
    getBannerList(state) {
      return state.bannerList;
    },
    getLoginInfo(state) {
      return state.loginInfo;
    },
    getUserName(state) {
      return state.userName;
    },
  },
});

export default store;
