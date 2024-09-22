// src/store/index.js
import { createStore } from "vuex";

const store = createStore({
  state: {
    pageLoading: false,
    pageLoadingText: "",
    systemMode: "",
  },
  mutations: {
    systemMode(state, mode) {
      state.systemMode = mode;
    },
    setPageLoading(state, isLoading) {
      state.pageLoading = isLoading;
    },
    setPageLoadingText(state, text) {
      state.pageLoadingText = text;
    },
  },
  actions: {
    setPageLoading({ commit }, isLoading) {
      commit("setPageLoading", isLoading);
    },
    setPageLoadingText({ commit }, text) {
      commit("setPageLoadingText", text);
    },
    updateSystemMode({ commit }, mode) {
      commit("systemMode", mode);
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
  },
});

export default store;
