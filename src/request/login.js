import service from "@/utils/request";

export function verify(data) {
  return service({
    url: "/api/Captcha/verify",
    method: "post",
    // isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function login(data) {
  return service({
    url: "/api/login/login",
    method: "post",
    isLoading: true,
    data,
    isCrypto: true,
    succMsg: false,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    // isCryptoPas: true,
  });
}

// 微信code授权
export function wx_login(data) {
  return service({
    url: "/api/login/wxlogin",
    method: "post",
    isLoading: true,
    loadingMsg: "正在授权登录",
    // customLoading:true, 是否自定义loading
    data,
  });
}
