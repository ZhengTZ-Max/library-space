import { createApp } from "vue";
import Antd from "ant-design-vue";
import _ from "lodash";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // 引入 store
import directives from "./directives";
import { t } from "./utils";
import PlaceImg from "@/assets/login/headerBg.png";

import "ant-design-vue/dist/reset.css";
import "./style.css";
import "./common.less";

// --- Vant组件
import {
  Button,
  List,
  ImagePreview,
  Swipe,
  SwipeItem,
  Overlay,
  Popup,
  Icon,
  Lazyload,
  Image,
  TimePicker,
  Cell,
  CellGroup,
  PullRefresh,
  Dialog,
  Field,
  Col,
  Row,
  Calendar,
  Toast,
} from "vant";
import "vant/lib/index.css";
import "vant/lib/icon/index.css";
const app = createApp(App);
directives(app);

app.use(TimePicker);
app.use(Image);
app.use(Lazyload);
app.use(Icon);
app.use(Popup);
app.use(Overlay);
app.use(Swipe);
app.use(SwipeItem);
app.use(ImagePreview);
app.use(Button);
app.use(List);
app.use(Cell);
app.use(CellGroup);
app.use(PullRefresh);
app.use(Dialog);
app.use(Field);
app.use(Col);
app.use(Row);
app.use(Calendar);
app.use(Toast);
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
window.$t = t;
app.config.globalProperties.PlaceImg = PlaceImg;

router.isReady().then(() => {
  app.mount("#app");
});
