import service from "@/utils/request";

// 获取柜子列表
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

// 获取柜子筛选项
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

// 获取柜子 详细信息
export function getLockerDetail(data) {
  return service({
    url: "/reserve/locker/detail",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 获取柜子 开放地图
export function getLockerMap(data) {
  return service({
    url: "/reserve/locker/map",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}
