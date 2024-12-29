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


