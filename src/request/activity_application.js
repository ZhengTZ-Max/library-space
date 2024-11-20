import service from "@/utils/request";

export function getActivityFilterIndex(data) {
  return service({
    url: "/v4/activity/sift",
      method: "POST",
      isLoading: true,
      // loadingMsg: "",
      // customLoading: true, //是否自定义loading
      data,
  });
}

export function getApplicationList(data) {
  return service({
    url: "/v4/activity/index",
    method: "POST",
    data,
  });
}

export function getActivityDetail(data) {
  return service({
    url: "/v4/activity/detail",
    method: "POST",
    data,
  });
}
