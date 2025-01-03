import service from "@/utils/request";

export function verify(data) {
  return service({
    url: "/v4/login/verify",
    method: "post",
    // isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function login(data) {
  return service({
    url: "/v4/login/login",
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
    url: "/v4/login/wxlogin",
    method: "post",
    isLoading: true,
    loadingMsg: "正在授权登录",
    // customLoading:true, 是否自定义loading
    data,
  });
}

// 企业微信code授权
export function qywx_login(data) {
  return service({
    url: "/v4/login/wxwork",
    method: "post",
    isLoading: true,
    loadingMsg: "正在授权登录",
    // customLoading:true, 是否自定义loading
    data,
  });
}

// 钉钉code授权
export function dingTalk_login(data) {
  return service({
    url: "/v4/login/dingtalksns",
    method: "post",
    isLoading: true,
    loadingMsg: "正在授权登录",
    // customLoading:true, 是否自定义loading
    data,
  });
}

// 微信取消绑定
export function wx_removeOpenid(data) {
  return service({
    url: "v4/member/unwx",
    method: "post",
    isLoading: true,
    // loadingMsg: "正在授权登录",
    // customLoading:true, 是否自定义loading
    data,
  });
}

// CAS登录配置
export function getCasLogin(data) {
  return service({
    url: "/v4/login/user",
    method: "post",
    isLoading: true,
    // loadingMsg:"正在授权登录",
    // customLoading:true, 是否自定义loading
    data,
  });
}

// CAS退出登录
export function outCasLogin(params) {
  return service({
    url: "/api/cas/cas",
    method: "get",
    isLoading: true,
    // loadingMsg:"正在授权登录",
    // customLoading:true, 是否自定义loading
    params,
  });
}
