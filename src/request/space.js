import service from "@/utils/request";

export function getSeminarIndex(data) {
  return service({
    url: "/v4/seminar/index",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
export function getSpaceSelectList(data) {
  return service({
    url: "/v4/seminar/siftdate",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
export function getSpaceFilterList(data) {
  return service({
    url: "/v4/seminar/sift",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
export function getSpaceInfoList(data) {
  return service({
    url: "/v4/seminar/list",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
export function getSpaceDetail(data) {
  return service({
    url: "/v4/seminar/detail",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
