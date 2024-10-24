import service from "@/utils/request";

export function getCategory(data) {
  return service({
    url: "/v4/index/category",
    method: "POST",
    // isLoading: true,
    // loadingMsg: "",
    customLoading: true, //是否自定义loading
    data,
  });
}
