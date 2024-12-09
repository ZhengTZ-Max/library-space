import service from "@/utils/request";

export function getLockerList(data) {
  return service({
    url: "/reserve/locker/list",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

export function getLockerFilter(data) {
  return service({
    url: "/reserve/locker/index",
    method: "GET",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
