import axios from "axios";
import store from "../store";
import { encrypt } from "../utils";
import { message } from "ant-design-vue";
const MODE = import.meta.env.MODE;
// 创建一个 axios 实例
const service = axios.create({
  baseURL: MODE == "production" ? "/" : "/api", // 所有的请求地址前缀部分
  timeout: 60000, // 请求超时时间毫秒
  withCredentials: true, // 异步请求携带cookie
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token") || "";
    // console.log(store);
    console.log(config);
    if (config?.isLoading) isAddPageLoading(config);
    if (token) {
      config.headers["authorization"] = `bearer${token}`;
      // config.headers["lang"] = lang;

      // if (config?.customHeaders) {
      //   config.headers = {
      //     ...config.headers,
      //     ...config.customHeaders,
      //   };
      //   delete config.customHeaders;
      // }

      if (config?.isCrypto) {
        let encryptStr = encrypt("encrypt", config.data);
        config.data = {
          aesjson: encryptStr,
        };
      }

      config.data = {
        ...eval(config.data),
        authorization: config.headers["authorization"],
      };
    } else {
      if (config?.isCrypto) {
        let encryptStr = encrypt("encrypt", config.data);
        config.data = {
          aesjson: encryptStr,
        };
      }
    }

    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    // console.log(error);
    // Toast.clear();
    ClearPageLoading(error?.config);

    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    console.log("response", response);
    isRemovePageLoading(response.config);
    // let decryptRequest = ["/api/index/config"];
    // let toastWhite = ["/api/Captcha/verify", "/api/index/subscribe"];

    if (response.config?.isCryptoPas) {
      let data = JSON.parse(encrypt("decrypt", response.data.data));
      response.data.data = data;
    }

    let { code, msg } = response.data;

    if (response.config?.succMsg) {
      if (code == 0) {
        message.success(msg);
      } else if (code == 1) {
        message.error(msg);
      }
    }

    // 2xx 范围内的状态码都会触发该函数。
    // const code = dataAxios.reset;
    return response.data;
  },
  function (error) {
    ClearPageLoading(error?.config);
    // Toast({
    //   message: "网络请求错误~",
    // });
    return Promise.reject(error);
  }
);

const isAddPageLoading = (config) => {
  if (!store?.state?.pageLoading) {
    store.commit("setPageLoading", true);

    config.PageLoading = true;
  }

  if (config?.loadingMsg) {
    store.commit("setPageLoadingText", config?.loadingMsg);
  } else {
    store.commit("setPageLoadingText", "");
  }
};

const isRemovePageLoading = (config) => {
  if (store?.state?.pageLoading && config?.isLoading) {
    store.commit("setPageLoading", false);
    config.PageLoading = false;
  }
};

const ClearPageLoading = (config) => {
  store.commit("setPageLoading", false);
  config.PageLoading = false;
};

export default service;
