import axios from "axios";
import store from "../store";
import { encrypt } from "../utils";
import { message } from "ant-design-vue";
import { showLoadingToast, closeToast } from "vant";
import { useRouter } from "vue-router";
const MODE = import.meta.env.MODE;
// 创建一个 axios 实例
const service = axios.create({
  baseURL: MODE === "production" ? "/" : "/api",
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 用于跟踪活动请求数量
let activeRequests = 0;

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    let token = sessionStorage.getItem("token") || "";
    console.log(config);
    // 增加请求计数
    if (config?.isLoading) {
      activeRequests++;
      showLoadingToast({
        forbidClick: true,
        duration: 0,
        message: config?.loadingMsg || "",
      });
    }

    if (token) {
      config.headers["authorization"] = `bearer${token}`;

      if (config?.isCrypto) {
        let encryptStr = encrypt("encrypt", config.data);
        config.data = { aesjson: encryptStr };
      }

      config.data = {
        ...config.data,
        // Authorization: config.headers["authorization"],
      };
    } else {
      if (config?.isCrypto) {
        let encryptStr = encrypt("encrypt", config.data);
        config.data = { aesjson: encryptStr };
      }
    }

    return config;
  },
  function (error) {
    // 请求错误时减少计数
    if (error?.config?.isLoading) {
      activeRequests--;
      ClearPageLoading();
    }
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    if (response.config?.isLoading) {
      activeRequests--;
      ClearPageLoading();
    }
    if (response.config?.isCryptoPas) {
      let data = JSON.parse(encrypt("decrypt", response.data.data));
      response.data.data = data;
    }

    let { code, msg, message: messg } = response.data;

    if (response.config?.succMsg) {
      if (code === 0) {
        // message.success(msg);
        message.error(msg);
      } else if (code === 1) {
        // message.error(msg);
        message.success(msg);
      }
    }

    if (code === 10001) {
      message.error(messg);
      setTimeout(() => {
        // localStorage.clear();
        // sessionStorage.clear();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("UserInfo");
        sessionStorage.removeItem("authError");
        sessionStorage.removeItem("verifyLogin");
        location.hash = "/login";
      }, 1000);
    }
    // 请求完成后减少计数

    return response.data;
  },
  function (error) {
    // 请求错误时减少计数
    if (error?.config?.isLoading) {
      activeRequests--;
      ClearPageLoading();
    }
    return Promise.reject(error);
  }
);

const ClearPageLoading = () => {
  activeRequests === 0 && closeToast();
};

export default service;
