import service from "@/utils/request";

export function getCurrentEventList(data) {
  return service({
    url: "/v4/activity/list",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
export function getEventFilterIndex(data) {
  return service({
    url: "/v4/activity/search",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getEventDetails(data) {
  return service({
    url: "/v4/activity/specific",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}