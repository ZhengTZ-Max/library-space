import service from "@/utils/request";

export function getLostAndFoundList(data) {
  return service({
    url: "/reserve/lostlocker/memberExtractBlackRecord",
    method: "POST",
    isLoading: true,
    // loadingMsg: "",
    // customLoading: true, //是否自定义loading
    data,
  });
}