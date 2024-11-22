import service from "@/utils/request";

export function getCategory(data) {
  return service({
    url: "/v4/index/category",
    method: "POST",
    // isLoading: true,
    // loadingMsg: "",
    customLoading: true, //是否自定义loading
    data,
  });
}

// 获取当前预约
export function getSubscribe(data) {
  return service({
    url: "/v4/index/subscribe",
    method: "POST",
    // isLoading: true,
    // loadingMsg: "",
    customLoading: true, //是否自定义loading
    data,
  });
}

// 取消座位预约
export function fetchCancelSeat(data) {
  return service({
    url: "/v4/space/cancel",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 取消考研/研习座位预约
export function fetchCancelStudyCancel(data) {
  return service({
    url: "/v4/space/studyCancel",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 座位签到
export function fetchSeatSignin(data) {
  return service({
    url: "/v4/space/signin",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 研习/考研座位签到
export function fetchSeatStudySign(data) {
  return service({
    url: "/v4/space/studySign",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 临时离开
export function fetchSeatleave(data) {
  return service({
    url: "/v4/space/leave",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 完全离开
export function fetchSeatCheckout(data) {
  return service({
    url: "/v4/space/checkout",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
