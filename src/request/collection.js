import service from "@/utils/request";

// 物品招领-列表页
export function getLostlocker(data) {
  return service({
    url: "/reserve/lostlocker/list",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 物品招领-区域列表
export function getAllArea(data) {
  return service({
    url: "/reserve/lostlocker/getAllArea",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 物品招领-物品详情
export function getLostInfo(data) {
  return service({
    url: "/reserve/lostlocker/info",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 物品收取-区域信息接口
export function getLostStorage(data) {
  return service({
    url: "/reserve/lostlocker/storage",
    method: "get",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 物品收取-提交存物
export function sumbitLostStorage(data) {
  return service({
    url: "/reserve/lostlocker/storage",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}


// 物品收取-清柜馆舍列表
export function getLostlockerIndex(data) {
  return service({
    url: "/reserve/lostlocker/cIndex",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}

// 物品收取-清柜格口列表
export function getLostlockerList(data) {
  return service({
    url: "/reserve/lostlocker/cList",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}



// 物品收取-清柜操作
export function fetchCleanLocker(data) {
  return service({
    url: "/reserve/lostlocker/cleanLocker",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}



