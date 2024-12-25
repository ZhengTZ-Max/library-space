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

// 确认预约格口
export function confirmLockBox(data) {
  return service({
    url: "/apiLocker/lock/bookBox",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 清柜-首页
export function clearBookcaseHome(data) {
  return service({
    url: "/reserve/locker/cIndex",
    method: "post",
    isLoading: true,
    // customLoading:true, 是否自定义loading
    data,
  });
}
