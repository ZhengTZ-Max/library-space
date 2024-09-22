import axios from "axios";
import store from "../store";
// import { encrypt } from "./help";
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
    // console.log(store)
    console.log(store);
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

      // if (encryptRequest.includes(config.url)) {
      //   let encryptStr = encrypt("encrypt", config.data);
      //   config.data = {
      //     aesjson: encryptStr,
      //   };
      // }
      config.data = {
        ...eval(config.data),
        authorization: config.headers["authorization"],
      };
    } else {
      // if (encryptRequest.includes(config.url)) {
      //   let encryptStr = encrypt("encrypt", config.data);
      //   config.data = {
      //     aesjson: encryptStr,
      //   };
      // }
      config.data = {
        ...eval(config.data),
      };
    }

    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    console.log(error);
    Toast.clear();
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
    let { code } = response.data;

    // if (decryptRequest.includes(response.config.url)) {
    //   let data = JSON.parse(encrypt("decrypt", response.data.data));
    //   response.data.data = data;
    //   console.log(response.data);
    //   return response.data;
    // }
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data;
    // 这个状态码是和后端约定的
    // const code = dataAxios.reset;
    return dataAxios;
  },
  function (error) {
    Toast({
      message: "网络请求错误~",
    });
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

export default service;
