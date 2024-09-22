import { createApp } from "vue";
import Antd from "ant-design-vue";
import _ from "lodash";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // 引入 store

import "ant-design-vue/dist/reset.css";
import "./style.css";

const app = createApp(App);
app.use(router);
app.use(Antd);
app.use(store);

window.onload = () => {
  computedWidth();
};

window.onresize = _.debounce(() => computedWidth(), 300);
// window.onEncrypt = encryptPas;

function computedWidth() {
  let deviceWidth = document.body.clientWidth;
  if (deviceWidth < 800) {
    store.dispatch("updateSystemMode", "mobile");
  } else {
    store.dispatch("updateSystemMode", "pc");
  }
}

router.isReady().then(() => {
  app.mount("#app");
});
