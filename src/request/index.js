import service from "@/utils/request";

export function getNotice(data) {
  return service({
    url: "/v4/index/notice",
    method: "POST",
    // loadingMsg:"正在登录",
    // isLoading: true,
    data,
  });
}

export function getGlobalConfig(data) {
  return service({
    url: "/v4/index/peizhi",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
    isCryptoPas: true,
  });
}

export function getGlobalLang(data) {
  return service({
    url: "/v4/index/lang",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
  });
}

export function getBanner(data) {
  return service({
    url: "/v4/index/banner",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
  });
}

// 获取服务器时间
export function getServeTime(data) {
  return service({
    url: "/api/index/time",
    method: "POST",
    isLoading: true,
    // customLoading:true, //是否自定义loading
    data,
  });
}

// 获取使用须知
export function getBookingRules(data) {
  return service({
    url: "/v4/index/bookingRules",
    method: "POST",
    isLoading: true,
    // customLoading:true, //是否自定义loading
    data,
  });
}

export function getNoticeInfo(data) {
  return service({
    url: "/v4/index/noticeDetail",
    method: "POST",
    // loadingMsg:"正在登录",
    isLoading: true,
    data,
  });
}
