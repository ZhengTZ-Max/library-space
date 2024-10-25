import { createApp } from "vue";
import Antd from "ant-design-vue";
import _ from "lodash";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // 引入 store
import directives from "./directives";
import { t } from "./utils";

import "ant-design-vue/dist/reset.css";
import "./style.css";

// --- Vant组件
import { Button, List, ImagePreview, Swipe, SwipeItem } from "vant";
import "vant/lib/index.css";

const app = createApp(App);
directives(app);

app.use(Swipe);
app.use(SwipeItem);
app.use(ImagePreview);
app.use(Button);
app.use(List);

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

// 注册全局函数
app.config.globalProperties.$t = t;

router.isReady().then(() => {
  app.mount("#app");
});
