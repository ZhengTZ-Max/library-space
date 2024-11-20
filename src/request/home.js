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

