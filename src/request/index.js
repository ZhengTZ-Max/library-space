import service from "@/utils/request";

export function getBanner(data) {
  return service({
    url: "/api/index/banner",
    method: "POST",
    // loadingMsg:"正在登录",
    customLoading: true, //是否自定义loading
    data,
  });
}
