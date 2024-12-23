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
    lang: "zh",

    userName: "",
    userId: "",

    pageResizing: false,
    rules: {},
  },
  mutations: {
    setRules(state, val) {
      state.rules = val;
      sessionStorage.setItem("BookRule", JSON.stringify(val));
    },
    setCategoryList(state, list) {
      state.categoryList = list;
      sessionStorage.setItem("categoryList", JSON.stringify(list));
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
      sessionStorage.setItem("UserInfo", JSON.stringify(info));
    },
    setApiConfig(state, info) {
      state.apiConfig = info;
      sessionStorage.setItem("apiConfig", JSON.stringify(info));
    },
    setLangData(state, data) {
      state.langData = data;
      sessionStorage.setItem("langData", JSON.stringify(data));
    },
    setLang(state, data) {
      state.lang = data;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setPageResizing(state, v) {
      state.pageResizing = v;
    },
  },
  actions: {
    setRules({ commit }, val) {
      commit("setRules", val);
    },
    setPageResizing({ commit }, val) {
      commit("setPageResizing", val);
    },
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
    setUserId({ commit }, id) {
      commit("setUserId", id);
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
    getUserId(state) {
      return state.userId;
    },
  },
});

export default store;
