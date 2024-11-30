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
    isLoading: true,
    data,
  });
}
export function getActivityApply(data) {
  return service({
    url: "/v4/activity/axis",
    method: "POST",
    isLoading: true,
    data,
  });
}


// 空间申请
export function activityApply(data) {
  return service({
    url: "/v4/activity/confirm",
    method: "POST",
    isLoading: true,
    data,
  });
}

// 空间申请须知
export function fetchActivityShould(data) {
  return service({
    url: "/v4/activity/should",
    method: "POST",
    isLoading: true,
    data,
  });
}
